
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
  let counter = 0;
  socket.on('message', (data) => {
    console.log('message from client side', data, typeof data);
   
    const prompt = {
      'yo': 'yo',
      'hello': 'hello',
      'hi': 'hi',
      'Bruce sucks': 'Bruce sucks',
      'hola': 'hola',
      'bonjour': 'bonjour'
    };
    let promptArr = [];
    for (let keys in prompt) {
      promptArr.push(keys);
    }
    if (data.text === 'start') {
      console.log("SOMETHING" )
        
      let message = {
        'user': 'ebot',
        'text': `Please say: ${promptArr[counter]}`
      };
      io.emit('message', message);
    } else {
      if (data.text === prompt[promptArr[counter]]) {
        let message = {
          'user': 'ebot',
          'text': `${data.user} got it right. good for him`
        };
        io.emit('message', message);
        counter++;
        message.text = `Please say: ${promptArr[counter]}`;
       io.emit('message', message);
      } else {
        let message = {
          'user': 'ebot',
          'text': `${data.user} is a fucking idiot. I told you to say "${promptArr[counter]}"`
        };
        io.emit('message', message);
      }
    }
  });

  socket.on('create', function(room) {
    console.log("IN SERVER ON ROOM CREATE" )
      
      socket.join(room);
    });
});
server.listen(port, () => {
  console.log('Listening on ' + server.address().port);
});