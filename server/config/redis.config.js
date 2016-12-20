
const Promise = require('bluebird');

const redis = require('promise-redis')(resolver => {
  return new Promise(resolver);
});

// const client = redis.createClient(process.env.REDIS_URL);

/**
 * To connect to local redis uncomment the line below
 */
const client = redis.createClient();

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
    console.log('hye', result);
    if (result) {
      console.log('Flush finished');
      return require('../db/Redis/RedisController.js').initAll();
    }
  })
  .then((result) => {
    console.log('yo', result);
    if (result) return require('../db/Redis/RedisController.js').checkAnswer('buff', '&#x1F4AA;');
  })
  .then(result => {
    console.log('is a member ', result);
    if (result) return require('../db/Redis/RedisController.js').getPrompts(1);
  })
  .then(prompts => {
    if (prompts) console.log('prompts...', prompts);
  })
  .catch(err => {
    throw err;
  });
});

module.exports = client;
