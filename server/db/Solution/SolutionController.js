
const models = require('../../config/db.config.js');

module.exports = {
  updateSolution: (req, res, next) => {
    if (req.body.solutionId && req.body.newSolution) {
      models.Solution.update(
        {
          name: req.body.newSolution,
          approved: true
        },
        {
          where: {
            id: req.body.solutionId
          }
        })
      .then(result => {
        res.json(result);
      })
      .catch(err => {
        res.json(err);
        throw err;
      });
    } else {
      res.json('Please provide a Solution Id');
    }
  },

  deleteSolution: (req, res, next) => {
    if (req.body.solutionId) {
      models.Solution.destroy({
        where: {
          id: req.body.solutionId
        }
      })
      .then(result => {
        res.json(result);
      })
      .catch(err => {
        res.json(err);
        throw err;
      });
    } else {
      res.json('Please provide a Solution Id');
    }
  }
};
