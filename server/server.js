const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage} = require('./utils/message');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('new user connected');

    socket.emit('newMessage', generateMessage('admin', 'Welcome user to our server!'));

    socket.broadcast.emit('newMessage', generateMessage('admin', 'A new user has joined the chat'));

    socket.on('createMessage', (message, callback) => {
        console.log('createMessage', message);

        io.emit('newMessage', generateMessage(message.from, message.text));
        callback('This is a message from the server');
    });

    socket.on('disconnect', () => {
        console.log('A connection was closed');
    });
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});