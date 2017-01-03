
const models = require('../../config/db.config.js');

module.exports = {
  addCommend: (imgUrl, insultFlag) => {
    if (imgUrl && insultFlag) {
      return models.Commend.findOrCreate({
        where: {url: imgUrl},
        defaults: {
          url: imgUrl,
          insultFlag: insultFlag
        }
      });
    } else return null;
  }
};
