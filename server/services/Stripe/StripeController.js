
const stripe = require('stripe')(process.env.STRIPE_SKEY);
module.exports = {

  chargeUser: (req, res, next) => {
    console.log('Receiving charge request', req.body);
    // let token = req.body.stripeToken;
    // let charge = req.body.chargeAmount;
    res.json('ok');
  }
};
