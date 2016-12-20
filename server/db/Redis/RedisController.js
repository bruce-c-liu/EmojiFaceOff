
const LibraryCtrl = require('../Library/LibraryController.js');
const redClient = require('../../config/redis.config.js');

module.exports = {

  /**
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
    .then(result => {
      return result;
    })
    .catch(err => {
      throw err;
    });
  },

  /**
   * Initialize levels with Prompts with a prefix L1P
   * for level 1 prompts in redis
   */
  initLTP: () => {
    return LibraryCtrl.allSolutionByLibrary()
    .then(result => {
      let LTPkeys = [
        [],   // level 0
        [],   // level 1
        [],   // level 2
        [],   // level 3
        [],   // level 4
        []    // level 5
      ];
      result.map(libEntry => {
        LTPkeys[libEntry.level].push(libEntry.prompt);
      });
      return LTPkeys;
    })
    .then(result => {
      return Promise.all(result.map((prompt, level) => {
        if (prompt.length) return redClient.sadd(`L${level}P`, prompt);
      }));
    })
    .then(result => {
      return result;
    })
    .catch(err => {
      throw err;
    });
  },

  initAll: () => {
    return module.exports.initPRA()
    .then(result => {
      if (result) return module.exports.initLTP();
    })
    .catch(err => {
      throw err;
    });
  },

  /**
   * Return the prompts for the specified level,
   * if not level is given then return all prompts
   */
  getPrompts: (level) => {
    if (level) return redClient.smembers(`L${level}P`);
    else return redClient.sunion(`L0P`, `L1P`, `L2P`, `L3P`, `L4P`, `L5P`);
  },

  checkAnswer: (prompt, answer) => {
    console.log('checking answer....', prompt, answer);
    return redClient.sismember(`PRA:${prompt}`, answer)
    .then(result => {
      console.log('checkanswer result', result);
      return result;
    })
    .catch(err => {
      throw err;
    });
  }

};
