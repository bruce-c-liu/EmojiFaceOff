
const models = require('../../config/db.config.js');

module.exports = {

  addCommend: (req, res) => {
    let imgUrl = req.body.imgUrl;
    let insultFlag = JSON.parse(req.body.insultFlag);

    models.Commend.findOrCreate({
      where: {
        url: imgUrl
      },
      defaults: {
        url: imgUrl,
        insultFlag: insultFlag
      }
    }).then(() => {
      res.status(203).json('Commend added successfully.');
    });
  },

  getAll: () => {
    return models.Commend.findAll({});
  }
};
