
const RoomController = require('../db/Room/RoomController.js');
const TwilioController = require('../services/Twilio/TwilioController.js');
module.exports = (app, express) => {
  app.get('/api/getRoom', RoomController.getRoom);

  app.post('/api/sendInvite', TwilioController.textMessage);
};
