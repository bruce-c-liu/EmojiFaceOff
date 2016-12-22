import axios from 'axios';

export function getRoomID() {
    return axios.get('/api/getRoom')
        .catch((err)=>{
            console.log(err )            
        })
}