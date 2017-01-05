// A higher number = better quality.
const MATCH_MAKING_QUALITY = 1;

// let queue = [{
//   elo: 1200,
//   roomId: 'asd1291'
// }, {
//   elo: 2103,
//   roomId: '09oi2j'
// }, {
//   elo: 931,
//   roomId: 'jif82i'
// }];

let queue = {};

module.exports = {
  getRoom: function (req, res) {
    let numInQueue = Object.keys(queue).length;
    if (numInQueue < MATCH_MAKING_QUALITY) {
      res.json({matchedRoom: false});
    } else {
      console.log('QUEUE CONTAINS', queue);
      let searcherELO = req.query.elo;
      let smallestDiff = Number.MAX_VALUE;
      let matchedRoom = '';
      let diff;
      for (var room in queue) {
        diff = Math.abs(searcherELO - queue[room]);
        if (diff < smallestDiff) {
          smallestDiff = diff;
          matchedRoom = room;
        }
      }
      delete queue[matchedRoom];
      console.log('THE MATCHED ROOM IS', matchedRoom);
      res.json({matchedRoom: matchedRoom});
    }
  },

  addRoom: function (req, res) {
    console.log('LOOK AT MEEEEEEE:', req.body);
    queue[req.body.roomId] = req.body.elo;
    res.status(201).json('Added roomId: ' + req.body.roomId + ' to queue.');
  },

  removeRoom: function (req, res) {
    delete queue[req.body.roomId];
    res.status(204);
  }
};
