export function formatUserInfo (name, avatar, uid) {
  return {
    name,
    avatar,
    uid
  };
}

let port = window.location.port;
let host = window.location.hostname;
let protocol = window.location.protocol;
let Path = '/';
// let url;
// let options = { };

if (protocol.indexOf('https') > -1) {
  protocol = 'wss:';
} else {
  protocol = 'ws:';
}

export const socketURL = protocol + '//' + host + ':' + port + Path;
// url = protocol + "//" + host + ":" + port + path;

export const inviteBaseURL = 'http://emojifaceoff.com/chat/';
