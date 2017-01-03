let Promise = require('bluebird');
const axios = require('axios');

module.exports = {
  shortURL: (req, res, next) => {
    let longURL = req.body.fullURL;
    return axios.get('https://api-ssl.bitly.com/v3/shorten', {
      params: {
        access_token: process.env.BITLY_ACCESS_TOKEN,
        longUrl: longURL
      }
    })
    .then(result => {
        // console.log('success getting shortened URL!', result);
      res.json(result.data);
    })
    .catch((err) => {
      console.log(err);
    });
  }
};
