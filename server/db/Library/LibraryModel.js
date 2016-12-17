
module.exports = (sequelize, DataTypes) => {
  const Library = sequelize.define('Library', {
    prompt: {
      type: DataTypes.TEXT
    },
    answer: {
      type: DataTypes.TEXT
    },
    level: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    approved: {
      type: DataTypes.BOOLEAN,
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
        Library.belongsTo(models.User);
      }
    }
  });

  return Library;
}
;
