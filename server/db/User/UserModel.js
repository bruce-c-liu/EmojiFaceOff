
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    displayName: {
      type: DataTypes.TEXT
    },
    imgUrl: {
      type: DataTypes.TEXT
    },
    role: {
      type: DataTypes.TEXT
    },
    banned: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    auth: {
      type: DataTypes.TEXT
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
