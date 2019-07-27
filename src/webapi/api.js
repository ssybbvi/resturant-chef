import io from 'socket.io-client';

export let subscriptionSocket = (eventName, cb) => {
    io('http://localhost:3000').on(eventName, cb);
}