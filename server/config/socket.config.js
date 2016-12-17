
module.exports = (server) => {
  const io = require('socket.io')(server);

  io.on('connection', (socket) => {
    console.log('Server socket is up');
    socket.emit('user connected');

    socket.on('message', (data) => {
      console.log('message from client', data);
      socket.emit('message', data);
    });
  });
};
