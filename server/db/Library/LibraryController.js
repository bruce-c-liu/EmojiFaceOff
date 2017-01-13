
const models = require('../../config/db.config.js');
const Promise = require('bluebird');
module.exports = {

  allSolutionByLibrary: () => {
    return models.Library.findAll({
      include: [models.Solution]
    })
    .catch(err => {
      throw err;
    });
  },

  prompt: (req, res, next) => {
    models.Library.findOne({
      where: {
        id: req.params.promptId
      },
      include: {
        model: models.Solution
      }
    })
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      res.json(err);
      throw err;
    });
  },

  pendPrompts: (req, res, next) => {
    let approved = true;
    if (req.params.type.startsWith('pend')) {
      approved = false;
    }
    models.Library.findAll({
      include: {
        model: models.Solution,
        where: {
          approved: approved
        }
      }
    })
    .then(result => {
      return Promise.all(result.map(pendItem => {
        return Promise.props({
          prompt: pendItem.prompt,
          promptId: pendItem.id,
          createdAt: pendItem.createdAt,
          Solutions: pendItem.Solutions.map(pendAnswer => {
            return pendAnswer.name;
          }),
          User: models.User.findById(pendItem.UserId)
        });
      }));
    })
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      res.json(err);
      throw err;
    });
  },

  updatePendPrompt: (req, res, next) => {
    let promptId = req.body.promptId;
    let promptLevel = req.body.promptLevel;
    models.Solution.update(
      {
        approved: true
      },
      {
        where: {
          LibraryId: promptId
        }
      })
    .then(result => {
      if (result) {
        return models.Library.update(
          {
            approved: true,
            level: promptLevel
          },
          {
            where: {
              id: promptId
            }
          });
      }
    })
    .then(result => {
      if (result) {
        res.json(result);
      }
    })
    .catch(err => {
      res.json(err);
      throw err;
    });
  },

  addPrompt: (req, res, next) => {
    let prompt = req.body.prompt;
    let answers = req.body.answers;
    let elength = answers.length;
    let LibId = null;
    let UserId = null;

    /**
     * Need to add a check if user is banned
     * and check if he's been spamming
     */
    if (elength > 0 && prompt.length > 0 && req.body.userFbId) {
      res.send(204);
      models.User.findOne({
        where: {auth: req.body.userFbId}
      })
      .then(result => {
        if (result.id) {
          UserId = result.id;
          models.Library.findOrCreate({
            where: {prompt: prompt},
            defaults: {
              prompt: prompt,
              UserId: UserId
            }
          })
          .then(result => {
            LibId = result[0].id;
            if (LibId) {
              return Promise.all(
                answers.map(oneAnswer => {
                  return models.Solution.findOrCreate({
                    where: {
                      name: oneAnswer,
                      LibraryId: LibId
                    },
                    defaults: {
                      name: oneAnswer,
                      length: [...oneAnswer].length,
                      LibraryId: LibId
                    }
                  });
                })
              );
            }
          })
          .then(result => {
            if (result[1]) console.log(`New answers( ${answers} ) for prompt( ${prompt} )`);
          })
          .catch(err => {
            throw err;
          });
        } else {
          res.send(501);
        }
      })
      .catch(err => {
        res.json(err);
        throw err;
      });
    } else {
      res.send(501);
    }
  }

};
