
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
    let tmp = answer;
    console.log('\u{1F4AA}' === '💪');
    console.log('checking answer....', prompt, tmp);
    return redClient.smembers(`PTA:${prompt}`)
      .then(answers => {
        console.log('ANSWERS:', answers);
        return answers.includes(answer);
      })
      .catch(err => {
        throw err;
      });
  }

};
