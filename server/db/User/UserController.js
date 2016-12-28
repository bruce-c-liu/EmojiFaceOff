
const models = require('../../config/db.config.js');
const redClient = require('../../config/redis.config.js');
module.exports = {

  /**
   * get a user(s) from postgres
   */
  getUser: (name) => {
    if (name) {
      return models.User.findOne({
        where: {
          displayName: name
        }
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
          redClient.saddd('allUsers', displayName)
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

      // models.User.findOrCreate({
      //   where: {displayName: displayName},
      //   default: {
      //     displayName: displayName,
      //     imgUrl: imgUrl,
      //     role: role,
      //     auth: auth
      //   }
      // })
      // .then(result => {
      //   let message = {
      //     created: result[1],
      //     userInst: result[0]
      //   };
      //   res.json(message);
      // })
      // .catch(err => {
      //   throw err;
      // });
    } else {
      res.json('Invalid input, please provide user displayName');
    }
  }
};
