const Sequelize = require('sequelize');
const path = require('path');
/**
 * Define paths to each model
 */
const modelPaths = [
  path.join(__dirname, '/../db/Library/LibraryModel.js'),
  path.join(__dirname, '/../db/User/UserModel.js'),
  path.join(__dirname, '/../db/Room/RoomModel.js'),
  path.join(__dirname, '/../db/Commend/CommendModel.js'),
  path.join(__dirname, '/../db/Solution/SolutionModel.js')
];

const sequelize = new Sequelize(process.env.DB_URL);

/**
 * Verify SQL connection has been established
 */
sequelize
  .authenticate()
  .then(message => {
    console.log('SQL Connection established to:', process.env.DB_HOST);
  })
  .catch(err => {
    throw err;
  });

const db = {};

/**
 * Allows us to reference each model from the db object
 * so we don't need to require different paths for different
 * models each time we need to access a model
 */
modelPaths.forEach(path => {
  let model = sequelize.import(path);
  db[model.name] = model;
});

Object.keys(db).forEach((modelName) => {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

