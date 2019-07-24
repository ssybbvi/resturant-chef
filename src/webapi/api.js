import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:3000');

function subscribeToWaitCookQueues(cb) {
    socket.on('orderItemQueue', (data) => {
        cb(null, data)
    });
}
export {
    subscribeToWaitCookQueues
};