export function formatUserInfo (name, avatar, uid) {
  return {
    name,
    avatar,
    uid,
  }
}


var port = window.location.port,
    host = window.location.hostname,
    protocol = window.location.protocol,
    path = '/',
    url, 
    options = { };

if( protocol.indexOf( 'https' ) > -1 ) {
    protocol = 'wss:';
} else {
    protocol = 'ws:'
}

export const socketURL = protocol + "//" + host + ":" + port + path;
//url = protocol + "//" + host + ":" + port + path;