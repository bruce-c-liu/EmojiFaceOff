
module.exports = (sequelize, DataTypes) => {
  const Library = sequelize.define('Library', {
    prompt: {
      type: DataTypes.STRING
    },
    level: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    approved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
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
        Library.hasMany(models.Solution);
      }
    }
  });

  return Library;
}
;
