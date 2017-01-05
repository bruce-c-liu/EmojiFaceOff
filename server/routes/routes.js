
const RoomController = require('../db/Room/RoomController.js');
const TwilioController = require('../services/Twilio/TwilioController.js');
const LibraryController = require('../db/Library/LibraryController.js');
const UserController = require('../db/User/UserController.js');
const RedisController = require('../db/Redis/RedisController.js');
const BitlyController = require('../services/Bitly/BitlyController.js');
const QueueController = require('../game/helpers/rankedQueue.js');
const StripeController = require('../services/Stripe/StripeController.js');

module.exports = (app, express) => {
  app.get('/api/getRoom', RoomController.getRoom); // deprecated

  app.post('/api/sendInvite', TwilioController.textMessage);
  app.post('/api/shortenURL', BitlyController.shortURL);

  app.get('/api/users', UserController.getAllUsers);
  app.get('/api/leaderBoard/:type', UserController.leaderBoard);
  app.post('/api/users', UserController.addUser);
  app.get('/api/users/:fbID', UserController.getUser);
  app.put('/api/users/:fbID', UserController.updateUser);

  app.get('/api/pendPrompts', LibraryController.pendPrompts);
  app.post('/api/requestPrompt', LibraryController.addPrompt);
  app.put('/api/pendPrompts', LibraryController.updatePendPrompt);

  app.get('/api/rankedQueue', QueueController.getRoom);
  app.post('/api/rankedQueue', QueueController.addRoom);
  app.delete('/api/rankedQueue', QueueController.removeRoom);

  app.get('/api/userCache', RedisController.getUsersCache);
  app.get('/api/adminCache', RedisController.getAdminsCache);

  app.post('/api/chargeUser', StripeController.chargeUser);

  app.get('*', (req, res) => {
    res.sendfile('./client/build/index.html');
  });
};
