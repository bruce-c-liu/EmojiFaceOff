
module.exports = (sequelize, DataTypes) => {
  const Room = sequelize.define('Room', {
    name: {
      type: DataTypes.TEXT
    },
    round: {
      type: DataTypes.INTEGER,
      defaultValue: 0
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
        Room.hasMany(models.User);
      }
    }
  });

  return Room;
}
;
