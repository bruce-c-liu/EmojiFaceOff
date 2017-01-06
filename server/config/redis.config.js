console.log('IN REDIS CONFIG');
const Promise = require('bluebird');

const redis = require('promise-redis')(resolver => {
  return new Promise(resolver);
});

const client = redis.createClient(process.env.REDIS_URL);
// const client = redis.createClient();

client.on('error', err => {
  console.log('uh oh Redis had an error connecting', err);
});

/**
 * Verify connection and intitialize redis with all the DB data
 * Note: uncomment the below if you want the guardian news to be cached
 * this was commented out to prevent hitting the max limit of api calls
 * during testing
*/
client.on('connect', () => {
  console.log(`Redis connection established to: ${process.env.REDIS_HOST}`);
  client.flushall()
  .then(result => {
    if (result) {
      console.log('Redis data flushed');
      return require('./helpers.js').initRedis();
    }
  })
  .then((result) => {
    if (result) console.log('Redis has finished intializing data.');
  })
  .catch(err => {
    throw err;
  });
});

module.exports = client;
