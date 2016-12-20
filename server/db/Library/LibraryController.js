
const models = require('../../config/db.config.js');

module.exports = {

  allSolutionByLibrary: () => {
    return models.Library.findAll({
      include: [models.Solution]
    })
    .catch(err => {
      throw err;
    });
  }
};
