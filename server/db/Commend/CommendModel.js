
module.exports = (sequelize, DataTypes) => {
  const Commend = sequelize.define('Commend', {
    url: {
      type: DataTypes.STRING
    },
    insultFlag: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    freezeTableName: true
  });

  return Commend;
}
;
