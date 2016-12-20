
const redClient = require('../../config/redis.config.js');

module.exports = {

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
