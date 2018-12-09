var socket = io();

//Not using arrow functions in frontend because a lot of devices has no support for ES6
socket.on('connect', function() {
    console.log('hey');
});

socket.on('disconnect', function() {
    console.log('bye');
});

socket.on('newMessage', function(message) {
    console.log(message);
});