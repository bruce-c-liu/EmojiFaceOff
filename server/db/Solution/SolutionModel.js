
module.exports = (sequelize, DataTypes) => {
  const Solution = sequelize.define('Solution', {
    name: {
      type: DataTypes.TEXT
    }
  }, {
    freezeTableName: true,
    classMethods: {
      associate: (models) => {
        Solution.belongsTo(models.Library);
      }
    }
  });

  return Solution;
}
;
