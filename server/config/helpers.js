
const LibraryCtrl = require('../db/Library/LibraryController.js');
const UserCtrl = require('../db/User/UserController.js');
const redClient = require('./redis.config.js');

module.exports = {

  /**
   * Redis
   * Initialize Prompts with Answers with a prefix "PRA:" in redis
   * and only add the prompts and answers that are approved
   */
  initPTA: () => {
    return LibraryCtrl.allSolutionByLibrary()
    .then(result => {
      return result
             .filter(libEntry => {
               if (libEntry.approved) return libEntry;
             })
             .map(libEntry => {
               return {
                 prompt: libEntry.prompt,
                 solutions: libEntry.Solutions
                            .filter(answer => {
                              if (answer.approved) return answer;
                            })
                            .map(answer => {
                              return answer.name;
                            })
               };
             });
    })
    .then(result => {
      return Promise.all(result.map(entry => {
        return redClient.sadd(`PTA:${entry.prompt}`, entry.solutions);
      }));
    })
    .catch(err => {
      throw err;
    });
  },

  /**
   * Redis
   * Initialize levels with Prompts with a prefix L1P
   * for level 1 prompts in redis
   */
  initLTP: () => {
    return LibraryCtrl.allSolutionByLibrary()
    .then(result => {
      let LTPkeys = [
        [],   // level 0 prompts
        [],   // level 1 prompts
        [],   // level 2 prompts
        [],   // level 3 prompts
        [],   // level 4 prompts
        []    // level 5 prompts
      ];

      result
      .filter(libEntry => {
        if (libEntry.approved) return libEntry;
      })
      .map(libEntry => {
        LTPkeys[libEntry.level].push(libEntry.prompt);
      });

      return Promise.all(LTPkeys.map((prompt, level) => {
        if (prompt.length) return redClient.sadd(`L${level}P`, prompt);
      }));
    })
    .catch(err => {
      throw err;
    });
  },

  initAllUsers: () => {
    UserCtrl.getAllUsers()
    .then(result => {
      return Promise.all(
        result.map(user => {
          return redClient.sadd(`allUsers`, `${user.displayName}:${user.auth}`);
        })
      );
    })
    .catch(err => {
      throw err;
    });
  },

  /**
   * Redis initialize all
   */
  initRedis: () => {
    return module.exports.initPTA()
    .then(result => {
      if (result) return module.exports.initLTP();
    })
    .then(result => {
      if (result) return module.exports.initAllUsers();
    })
    .catch(err => {
      throw err;
    });
  }

};
