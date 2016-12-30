import axios from 'axios';

// deprecated
export function getRoomID () {
  return axios.get('/api/getRoom')
        .catch((err) => {
          console.log(err);
        });
}

export function getUser (fbID) {
  return axios.get(`/api/getUser?fbId=${fbID}`)
              .catch((err) => {
                console.log(err);
              });
}

// deprecated
export function getUserELO (fbID) {
  return axios.get(`/api/getUser?fbId=${fbID}`)
              .catch((err) => {
                console.log(err);
              });
}

export function SMSInvite (userName, roomUrl, numbers) {
  console.log('USERNAME FROM SMS', userName);

  return axios.post('/api/sendInvite', {
    userName: userName,
    roomUrl: roomUrl,
    numbers: numbers
  })
  .catch((err) => {
    console.log(err);
  });
}

export function saveNewUser (newUser) {
  return axios.post('/api/addUser', {
    displayName: newUser.name,
    imgUrl: newUser.avatar,
    auth: newUser.uid
  })
    .catch((err) => {
      console.log(err);
    });
}
