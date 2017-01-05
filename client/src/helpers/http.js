import axios from 'axios';

export function getUser (fbID) {
  return axios.get(`/api/users/${fbID}`)
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
  console.log("SAVE NEW USER",newUser )
    
  return axios.post('/api/users', {
    displayName: newUser.name,
    imgUrl: newUser.avatar,
    auth: newUser.uid
  })
    .catch((err) => {
      console.log(err);
    });
}
export function shortenLink(longURL) {   
    return axios.post('/api/shortenURL', {
            fullURL: longURL
        })
        .catch((err) => {
            console.log(err);
        });
}
