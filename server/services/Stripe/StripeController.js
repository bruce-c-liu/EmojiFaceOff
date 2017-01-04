
const stripe = require('stripe')(process.env.STRIPE_SKEY);
const UserController = require('../../db/User/UserController.js');

module.exports = {

  chargeUser: (req, res, next) => {
    console.log('Receiving charge request', req.body);
    const chargeAmount = {
      'corn': 100,
      'hot': 500,
      'space': 1000
    };
    const coinAmount = {
      'corn': 1000,
      'hot': 7500,
      'space': 16000
    };
    let token = req.body.token.id || null;
    let fbId = req.body.fbId || null;
    let cashMoola = chargeAmount[req.body.coinPack] || null;
    let coins = coinAmount[req.body.coinPack] || null;

    if (token && fbId && cashMoola) {
      stripe.charges.create({
        amount: cashMoola,
        currency: 'usd',
        source: token,
        description: 'charge at 1120'
      })
      .then(result => {
        console.log('Payment success', result.paid && !result.failurecode && coins, coins);
        if (result.paid && !result.failurecode && coins) {
          UserController.incrUserCoin(fbId, coins);
        } else {
          res.json(result);
        }
      })
      .catch(err => {
        res.json(err);
        throw err;
      });
    } else {
      console.log('invalid input', token, fbId, cashMoola);
      res.json('Please provide valid input');
    }
  }
};
