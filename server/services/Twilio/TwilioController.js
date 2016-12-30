const twilClient = require('../../config/twilio.config.js');
let Promise = require('bluebird');

module.exports = {

  textMessage: (req, res, next) => {
    console.log('Trying to invite ', req.body);
    /**
      * Expects:
      *  numbers: array,
      *  userName: string,
      *  roomUrl: string
      */
    let message = `👋${req.body.userName} has invited you to play EmojiFaceOff 😀! Click to join game , ${req.body.roomUrl} `;

    Promise.map(req.body.numbers, number => {
      return twilClient.sendMessage({
        to: number,
        from: process.env.TWILIO_CALLER_ID,
        body: message
      });
    }).then(result => {
      console.log('success sending game invites via texts!');
      res.json(result);
    })
    .catch(err => {
      res.send(404);
      throw err;
    });
  }
};
