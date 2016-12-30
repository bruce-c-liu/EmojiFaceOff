import axios from 'axios';

export function getRoomID () {
  return axios.get('/api/getRoom')
        .catch((err) => {
          console.log(err);
        });
}

export function SMSInvite (userName, roomUrl, numbers) {
    return axios.post('/api/sendInvite',{
    	userName: userName,
    	roomUrl: roomUrl,
    	numbers: numbers
    })
    .catch((err) => {
      console.log(err);
    });
}

export function saveNewUser(newUser){
    return axios.post('/api/addUser',{
      displayName: newUser.name,
      imgUrl: newUser.avatar,
      auth: newUser.uid
    })
    .catch((err) => {
      console.log(err);
    })
}
