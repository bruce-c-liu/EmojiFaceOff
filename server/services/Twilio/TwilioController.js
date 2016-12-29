
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
    // let numbers = req.body.numbers.map(num => {
    //   return twilClient.sendMessage({
    //     to: 'num',
    //     from: process.env.TWILIO_CALLER_ID,
    //     body: message
    //   });

    // });
    return twilClient.sendMessage({
            to: req.body.numbers,
            from: process.env.TWILIO_CALLER_ID,
            body: message
          });

    Promise.all(numbers)
    .then(result => {
      console.log('success sending game invites via texts!');
      res.json(result);
    })
    .catch(err => {
      res.send(404);
      throw err;
    });
  }

};
