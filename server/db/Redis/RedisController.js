
const LibraryCtrl = require('../Library/LibraryController.js');
const redClient = require('../../config/redis.config.js');

module.exports = {

  init: () => {
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
      // console.log('Lib Entries With Solutions', result);
      // return redClient.sadd(result[0].prompt, result[0].solutions);
      return Promise.all(result.map(entry => {
        // console.log('trying to store: ', entry.prompt, entry.solutions);
        return redClient.sadd(entry.prompt, entry.solutions);
      }));
    })
    .then(result => {
      return result;
    })
    .catch(err => {
      throw err;
    });
  },

  checkAnswer: (prompt, answer) => {
    console.log('checking answer....', prompt, answer);
    return redClient.sismember(prompt, answer)
    .then(result => {
      console.log('checkanswer result', result);
      return result;
    })
    .catch(err => {
      throw err;
    });
  }

};
