
// require('dotenv').config();

// // const models = require('./config/db.connect.js');

// // models.sequelize.sync().then(() => {
// const express = require('express');
// const app = express();
// const port = process.env.PORT || 8080;

// require('./config/middleware.js')(app, express);
// require('./routes/routes.js')(app, express);
// app.listen(port, () => {
//   console.log('Listening on port ' + port);
// });
// // });

const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3001;
require('./config/middleware.js')(app, express);
// require('./server/config/socket.js')(server);
// require('./server/config/socket.io.js')(server);
// server.on('request', app);
io.on('connection', (socket) => {
  console.log('Server socket is up');
  socket.broadcast.emit('user connected');
  
  socket.on('message', (data) => {
    console.log('message from client', data);
    socket.broadcast.emit('message', data);
  });
});
server.listen(port, () => {
  console.log('Listening on ' + server.address().port);
});
