
const RoomController = require('../db/Room/RoomController.js');
const TwilioController = require('../services/Twilio/TwilioController.js');
const LibraryController = require('../db/Library/LibraryController.js');
const UserController = require('../db/User/UserController.js');

module.exports = (app, express) => {
  app.get('/api/getRoom', RoomController.getRoom); // deprecated

  app.post('/api/sendInvite', TwilioController.textMessage);

  app.get('/api/getUser', UserController.getUser);
  app.get('/api/getUserELO', UserController.getUserELO);
  app.get('/api/getAllUsers', UserController.getAllUsers);
  app.post('/api/addUser', UserController.addUser);

  app.get('*', (req, res) => {
    res.sendfile('./client/build/index.html');
  });

  app.post('/api/requestPrompt', LibraryController.addPrompt);
};
