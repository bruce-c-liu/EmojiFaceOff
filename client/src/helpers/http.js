import axios from 'axios';

export function getRoomID () {
  return axios.get('/api/getRoom')
        .catch((err) => {
          console.log(err);
        });
}

export function SMSInvite (userName, roomUrl, numbers) {
	console.log("USERNAME FROM SMS", userName )
		
  return axios.post('/api/sendInvite',{
  	userName: userName,
  	roomUrl: roomUrl,
  	numbers: numbers
  })
        .catch((err) => {
          console.log(err);
        });
}
