export const soundsData = {
  // If no additional configuration is necessary, we can just pass a string  as the path to our file.
  endTurn: 'https://s3.amazonaws.com/bucketName/end_turn.mp3',

  // Alternatively, we can pass a configuration object.
  // All valid howler.js options can be used here.
  test: {
    urls: [
      '%PUBLIC_URL%/sounds/Action_Lock 01.mp3'
    ],
    volume: 0.75
  }

  // Audio sprites are supported. They follow the Howler.js spec.
  // Each sprite has an array with two numbers:
  //   - the start time of the sound, in milliseconds
  //   - the duration of the sound, in milliseconds

};
