const shortid = require('shortid');
const models = require('../../config/db.config.js');

module.exports = {

  getRoom: (req, res, next) => {
    res.json('' + shortid.generate());
  }
};
