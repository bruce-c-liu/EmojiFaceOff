
const TwilioController = require('../services/Twilio/TwilioController.js');
const LibraryController = require('../db/Library/LibraryController.js');
const UserController = require('../db/User/UserController.js');
const RedisController = require('../db/Redis/RedisController.js');
const BitlyController = require('../services/Bitly/BitlyController.js');
const QueueController = require('../game/helpers/rankedQueue.js');
const SolutionController = require('../db/Solution/SolutionController.js');
const StripeController = require('../services/Stripe/StripeController.js');
const SendGridController = require('../services/SendGrid/SendGridController.js');

module.exports = (app, express) => {
  app.post('/api/sendInvite', TwilioController.textMessage);
  app.post('/api/shortenURL', BitlyController.shortURL);

  app.get('/api/users', UserController.getAllUsers);
  app.get('/api/leaderBoard/:type', UserController.leaderBoard);
  app.post('/api/users', UserController.addUser);
  app.get('/api/users/:fbID', UserController.getUser);
  app.put('/api/users/:fbID', UserController.updateUser);
  app.put('/api/hintUsed', UserController.decrUserCoin);

  app.get('/api/prompts/:type', LibraryController.pendPrompts);
  app.get('/api/prompt/:promptId', LibraryController.prompt);
  app.post('/api/requestPrompt', LibraryController.addPrompt);
  app.put('/api/pendPrompts', LibraryController.updatePendPrompt);

  app.get('/api/rankedQueue', QueueController.getRoom);
  app.post('/api/rankedQueue', QueueController.addRoom);
  app.delete('/api/rankedQueue', QueueController.removeRoom);

  app.get('/api/userCache', RedisController.getUsersCache);
  app.get('/api/adminCache', RedisController.getAdminsCache);

  app.post('/api/chargeUser', StripeController.chargeUser);

  app.post('/api/feedback', SendGridController.emailFeedback);

  app.put('/api/updateSolution', SolutionController.updateSolution);
  app.put('/api/deleteSolution', SolutionController.deleteSolution);

  app.get('*', (req, res) => {
    res.sendfile('./client/build/index.html');
  });
};
