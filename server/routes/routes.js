
const RoomController = require('../db/Room/RoomController.js');
module.exports = (app, express) => {
  app.get('/api/getRoom', RoomController.getRoom);
};
