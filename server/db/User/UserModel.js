
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
    mmr: {
      type: DataTypes.INTEGER
    },
    spareTxt: {
      type: DataTypes.TEXT
    },
    spareInt: {
      type: DataTypes.INTEGER
    }
  }, {
    freezeTableName: true,
    classMethods: {
      associate: (models) => {
        User.belongsTo(models.Room);
        User.hasMany(models.Library);
      }
    }
  });

  return User;
}
;
