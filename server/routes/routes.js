
const RoomController = require('../db/Room/RoomController.js');
const TwilioController = require('../services/Twilio/TwilioController.js');
const LibraryController = require('../db/Library/LibraryController.js');
const UserController = require('../db/User/UserController.js');

module.exports = (app, express) => {
  app.get('/api/getRoom', RoomController.getRoom); // deprecated

  app.post('/api/sendInvite', TwilioController.textMessage);

  app.get('/api/users', UserController.getAllUsers);
  app.post('/api/users', UserController.addUser);
  app.get('/api/users/:fbID', UserController.getUser);
  app.put('/api/users/:fbID', UserController.updateUserELO);

  app.get('*', (req, res) => {
    res.sendfile('./client/build/index.html');
  });

  app.post('/api/requestPrompt', LibraryController.addPrompt);
};
