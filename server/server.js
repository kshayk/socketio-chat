const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('new user connected');

    socket.emit('newEmail', {
        'from': 'kshayk@gmail.com',
        'message': 'Hey there!!',
        'createdAt': 1234
    });

    socket.on('createEmail', (newEmail) => {
        console.log('createEmail', newEmail);
    });

    socket.on('disconnect', () => {
        console.log('A connection was closed');
    });
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});