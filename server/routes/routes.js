
const RoomController = require('../db/Room/RoomController.js');
const TwilioController = require('../services/Twilio/TwilioController.js');
const LibraryController = require('../db/Library/LibraryController.js');

module.exports = (app, express) => {
  app.get('/api/getRoom', RoomController.getRoom);
  app.post('/api/sendInvite', TwilioController.textMessage);
  app.get('*', (req, res) => {
    res.sendfile('./client/build/index.html');
  });
  app.post('/api/requestPrompt', LibraryController.addPrompt);
};
