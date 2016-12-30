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
    return axios.get(`https://api-ssl.bitly.com/v3/shorten`, {
            params: {
                access_token: '867257fcbc3e958bdbd25b2e00a4e07aa1d562b',
                long_url: longURL
            }
        })
        .then( (response) =>{
          console.log("BITLY RESP",response);
        })
        .catch((err) => {
            console.log(err);
        });
}
