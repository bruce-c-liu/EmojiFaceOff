
const stripe = require('stripe')(process.env.STRIPE_SKEY);
const UserController = require('../../db/User/UserController.js');

module.exports = {

  chargeUser: (req, res, next) => {
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
    let email = req.body.token.email || null;
    let fbId = req.body.fbId || null;
    let cashMoola = chargeAmount[req.body.coinPack] || null;
    let coins = coinAmount[req.body.coinPack] || null;
    if (token && fbId && cashMoola) {
      stripe.charges.create({
        amount: cashMoola,
        receipt_email: email,
        currency: 'usd',
        source: token,
        description: `${req.body.coinPack.toUpperCase()} Doge Coin Pack! 
                      ${coins} coins have been credited to your account!  `
      })
      .then(result => {
        if (result.paid && !result.failurecode && coins) {
          UserController.incrUserCoin(fbId, coins, res);
        } else {
          res.json(result);
        }
      })
      .catch(err => {
        res.json(err);
        throw err;
      });
    } else {
      res.json('Please provide valid input');
    }
  }
};
