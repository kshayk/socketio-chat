const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('new user connected');

    socket.on('join', (params, callback) => {
        if( ! isRealString(params.name) || ! isRealString(params.room)) {
            return callback("Name and room name are required");
        }

        socket.join(params.room);
        //if user already exists, delete it
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);

        io.to(params.room).emit('updateUserList', users.getUserList(params.room));
        socket.emit('newMessage', generateMessage('admin', 'Welcome user to our server!'));

        socket.broadcast.to(params.room).emit('newMessage', generateMessage('admin', `${params.name} has joined the server`));

        callback();
    });

    socket.on('createMessage', (message, callback) => {
        var user = users.getUser(socket.id);

        if(user && isRealString(message.text)) {
            io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
        }

        callback('This is a message from the server');
    });

    socket.on('createLocationMessage', (coords, callback) => {
        var user = users.getUser(socket.id);

        if(user) {
            io.to(user.room).emit('newLocationMessage', generateMessage(user.name, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`));
        }

        callback();
    });

    socket.on('disconnect', () => {
        var user = users.removeUser(socket.id);

        if(user) {
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('admin', `The user ${user.name} left the room`));
        }
    });
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});