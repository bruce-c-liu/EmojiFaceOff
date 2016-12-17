
require('dotenv').config();

const models = require('./config/db.config.js');

models.sequelize.sync().then(() => {
  const express = require('express');
  const app = express();

  const server = require('http').createServer(app);
  const port = process.env.PORT || 3001;

  require('./config/middleware.js')(app, express);
  require('./routes/routes.js')(app, express);
  require('./config/socket.config.js')(server);
  require('./config/redis.config.js');
  server.listen(port, () => {
    console.log('Server/Socket listening on port ' + port);
  });
});

