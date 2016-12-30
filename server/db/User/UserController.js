
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

  updateUserELO: (req, res, next) => {
    if (req.params.fbID) {
      models.User.findOne({
        where: {
          auth: req.params.fbID
        }
      })
      .then(result => {
        if (result) {
          result.update({
            ELO: req.body.elo
          })
          .then(() => {
            res.json('User\'s ELO has been successfully updated');
          });
        } else res.json('No user found');
      })
      .catch(err => {
        res.json(err);
        throw err;
      });
    } else {
      res.json('Please provide a unique fbId');
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

  /**
   * add user to database if it does not exist
   * expects: {name, auth, imgUrl, role}
   */
  addUser: (req, res, next) => {
    if (req.body.displayName) {
      let displayName = req.body.displayName;
      let imgUrl = req.body.imgUrl || '';
      let role = req.body.role || 'user';
      let auth = req.body.auth || '';

      redClient.sismember('allUsers', displayName)
      .then(result => {
        if (result) res.json('User already exists');
        else {
          redClient.sadd('allUsers', displayName)
          .then(result => {
            if (result) console.log(`${displayName} has been added to the redis cache`);
            res.json(`${displayName} has been added to the redis cache`);
          })
          .catch(err => {
            throw err;
          });

          models.User.create({
            displayName: displayName,
            imgUrl: imgUrl,
            role: role,
            auth: auth
          })
          .then(result => {
            if (result) console.log(`${displayName} has been added to the PostGres`);
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
