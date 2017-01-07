
const models = require('../../config/db.config.js');
const redClient = require('../../config/redis.config.js');
module.exports = {

  getUser: (req, res, next) => {
    if (req.params.fbID) {
      models.User.findOne({
        where: {
          auth: req.params.fbID
        }
      })
      .then(result => {
        if (result) res.json(result);
        else res.json('No user found');
      })
      .catch(err => {
        res.json(err);
        throw err;
      });
    } else {
      res.json('Please provide a unique fbId');
    }
  },

  updateUser: (req, res, next) => {
    if (req.params.fbID) {
      models.User.findOne({
        where: {
          auth: req.params.fbID
        }
      })
      .then(result => {
        if (result) {
          if (req.body.elo) {
            result.update({
              ELO: req.body.elo
            })
            .then(() => {
              res.json('User\'s ELO has been successfully updated');
            });
          } else if (req.body.coins) {
            result.update({
              coins: req.body.coins
            })
            .then(() => {
              res.json('User\'s coin count has been successfully updated');
            });
          }
        } else {
          res.json('No user found');
        }
      })
      .catch(err => {
        res.json(err);
        throw err;
      });
    } else {
      res.json('Please provide a unique fbId');
    }
  },

  incrUserCoin: (fbId, coins) => {
    if (fbId) {
      models.User.findOne({
        where: {
          auth: fbId
        }
      })
      .then(result => {
        if (result) {
          let displayName = result.displayName;
          let origAmount = result.coins;
          let newAmount = origAmount + coins;
          result.update({
            coins: newAmount
          })
          .then((result) => {
            if (result) console.log(`${displayName}'s coins updated from ${origAmount} to ${newAmount}`);
          });
        } else console.log('No user found');
      })
      .catch(err => {
        console.log(err);
        throw err;
      });
    } else {
      console.log('Please provide a unique fbId');
    }
  },

  getAllUsers: (req, res, next) => {
    if (req) {
      models.User.findAll({})
      .then(result => {
        res.json(result);
      })
      .catch(err => {
        res.json(err);
        throw err;
      });
    } else {
      return models.User.findAll({});
    }
  },

  leaderBoard: (req, res, next) => {
    let limit = req.body.limit || 10;
    if (req.params.type === 'ELO' || req.params.type === 'SPR') {
      models.User.findAll({
        order: `"${req.params.type}" DESC`,
        limit: limit
      })
      .then(result => {
        res.json(result);
      })
      .catch(err => {
        res.json(err);
        throw err;
      });
    } else res.json('Invalid parameter for Type. ');
  },

  /**
   * add user to database if it does not exist
   * expects: {name, auth, imgUrl, role}
   *
   * redis will cache each to an allUsers set with
   * the displayName and the auth. Ex: 'John:23EFE343dsthqw'
   */
  addUser: (req, res, next) => {
    if (req.body.displayName) {
      let displayName = req.body.displayName;
      let email = req.body.email || '';
      let imgUrl = req.body.imgUrl || '';
      let role = req.body.role || 'user';
      let auth = req.body.auth || '';
      console.log('checking if user exists....');
      redClient.sismember('allUsers', `${displayName}:${auth}`)
      .then(result => {
        if (result) {
          console.log('user exists...., searching for user in database', auth);
          models.User.findOne({
            where: {
              auth: auth
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
          redClient.sadd('allUsers', `${displayName}:${auth}`)
          .then(result => {
            if (result) console.log(`${displayName} has been added to the redis cache`);
            // res.json(`${displayName} has been added to the redis cache`);
          })
          .catch(err => {
            throw err;
          });

          models.User.create({
            displayName: displayName,
            email: email,
            imgUrl: imgUrl,
            role: role,
            auth: auth
          })
          .then(result => {
            if (result) {
              console.log(`${displayName} has been added to the PostGres`);
              res.json(result);
            }
          });
        }
      })
      .catch(err => {
        throw err;
      });
    } else {
      res.json('Invalid input, please provide user displayName');
    }
  }
};
