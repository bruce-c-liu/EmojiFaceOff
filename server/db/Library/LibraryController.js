
const models = require('../../config/db.config.js');

module.exports = {

  allSolutionByLibrary: () => {
    return models.Library.findAll({
      include: [models.Solution]
    })
    .catch(err => {
      throw err;
    });
  },

  pendPrompts: (req, res, next) => {
    console.log('in pending prompts');
    models.Library.findAll({
      where: {
        approved: true
      },
      include: {
        model: models.Solution,
        where: {
          approved: true
        }
      }
    })
    .then(result => {
      console.log(result);
      res.json(result);
    })
    .catch(err => {
      throw err;
    });
  },

  addPrompt: (req, res, next) => {
    console.log('request to add prompt', req.body, req.body.answer, [...req.body.answer].length);
    let prompt = req.body.prompt;
    let answer = req.body.answer;
    let elength = [...answer].length;
    let LibId = null;
    let user = req.body.user;

    /**
     * Need to add a check if user is banned
     * and check if he's been spamming
     */
    models.Library.findOrCreate({
      where: {prompt: prompt},
      defaults: {
        prompt: prompt
      }
    })
    .then(result => {
      LibId = result[0].id;
      if (LibId) {
        return models.Solution.findOrCreate({
          where: {name: answer},
          defaults: {
            name: answer,
            length: elength,
            LibraryId: LibId
          }
        });
      }
    })
    .then(result => {
      if (result[1]) console.log(`New answer( ${answer} ) for prompt( ${prompt} )`);
      else console.log(`Answer ( ${answer} ) already exists for prompt( ${prompt} )`);
    })
    .catch(err => {
      throw err;
    });
  }

};
