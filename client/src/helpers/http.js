import axios from 'axios';

export function postCHAT(message) {
    return axios.get('/api/chat', {
            params: {
		user: message.user,
		text: message.text
            }
        })
        .catch((err)=>{
            console.log(err )            
        })
}