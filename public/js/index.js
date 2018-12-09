var socket = io();

//Not using arrow functions in frontend because a lot of devices has no support for ES6
socket.on('connect', function() {
    console.log('hey');

    socket.emit('createEmail', {
        from: 'someone@gmail.com',
        to: 'someoneElse@gmail.com',
        message: 'hello there'
    })
});

socket.on('disconnect', function() {
    console.log('bye');
});

socket.on('newEmail', function(email) {
    console.log(email);
});