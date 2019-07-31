import io from 'socket.io-client';

//let url = "http://35.236.174.214:3000"
let url = "http://localhost:3000"

let socketInstance = io(url, {
    transports: ['websocket', 'xhr-polling', 'jsonp-polling']
})
export let subscriptionSocket = (eventName, cb) => {
    socketInstance.on(eventName, cb);
    return () => {
        socketInstance.removeListener(eventName, cb);
    }
}