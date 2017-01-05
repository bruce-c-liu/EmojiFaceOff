// A higher number = better quality.
const MATCH_MAKING_QUALITY = 1;

// {
//  'jif92i': 931,
//  '0a90x2': 2103
// }
let queue = {};

module.exports = {
  getRoom: function (req, res) {
    let numInQueue = Object.keys(queue).length;
    if (numInQueue < MATCH_MAKING_QUALITY) {
      res.json({matchedRoom: false});
    } else {
      console.log('RANKED QUEUE CONTAINS', queue);
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
      res.json({matchedRoom: matchedRoom});
    }
  },

  addRoom: function (req, res) {
    queue[req.body.roomId] = req.body.elo;
    res.status(201).json('Added roomId: ' + req.body.roomId + ' to queue.');
  },

  removeRoom: function (roomId) {
    delete queue[roomId];
  }
};
