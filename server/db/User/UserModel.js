
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    displayName: {
      type: DataTypes.STRING
    },
    imgUrl: {
      type: DataTypes.STRING
    },
    role: {
      type: DataTypes.STRING
    },
    banned: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    auth: {
      type: DataTypes.STRING
    },
    ELO: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    freezeTableName: true,
    classMethods: {
      associate: (models) => {
        User.hasMany(models.Library);
      }
    }
  });

  return User;
}
;
