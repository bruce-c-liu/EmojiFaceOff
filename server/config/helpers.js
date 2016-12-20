
const LibraryCtrl = require('../db/Library/LibraryController.js');
const redClient = require('./redis.config.js');

module.exports = {

  /**
   * Redis
   * Initialize Prompts with Answers with a prefix "PRA:" in redis
   */
  initPRA: () => {
    return LibraryCtrl.allSolutionByLibrary()
    .then(result => {
      return result.map(libEntry => {
        return {
          prompt: libEntry.prompt,
          solutions: libEntry.Solutions.map(answer => {
            return answer.name;
          })
        };
      });
    })
    .then(result => {
      return Promise.all(result.map(entry => {
        return redClient.sadd(`PRA:${entry.prompt}`, entry.solutions);
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

      result.map(libEntry => {
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

  /**
   * Redis initialize all
   */
  initRedis: () => {
    return module.exports.initPRA()
    .then(result => {
      if (result) return module.exports.initLTP();
    })
    .catch(err => {
      throw err;
    });
  }

};
