var socket = io();

function scrollToBottom() {
    //selectors
    var messages = $("#messages");
    var newMessage = messages.children('li:last-child');

    //heights
    var clientHight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();

    if(clientHight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        messages.scrollTop(scrollHeight);
    }
}

//Not using arrow functions in frontend because a lot of devices has no support for ES6
socket.on('connect', function() {
    console.log('hey');

    var params = $.deparam(window.location.search);

    socket.emit('join', params, function(err) {
        if(err) {
            alert(err);
            window.location.href = '/';
        } else {
            console.log('no error');
        }
    });
});

socket.on('disconnect', function() {

});

socket.on('updateUserList', function(users) {
    var ol = $('<ol></ol>');

    users.forEach(function (user) {
        ol.append($(`<li></li>`).text(user));
    });

    $("#users").html(ol)
});

socket.on('newMessage', function(message) {
    var formattedTime= moment(message.createdAt).format('h:mm a');

    var template = $("#messageTemplate").html();
    var html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt: formattedTime
    });

    $("#messages").append(html);
    scrollToBottom();
});

socket.on('newLocationMessage', function (message) {
    var formattedTime= moment(message.createdAt).format('h:mm a');

    var template = $("#messageLocationTemplate").html();
    var html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt: formattedTime
    });

    $("#messages").append(html);
    scrollToBottom();
});

$('#messageForm').on('submit', function(e) {
    e.preventDefault();

    $("#submitForm").attr('disabled', 'disabled');

    socket.emit('createMessage', {
        text: $("[name=message]").val()
    }, function(message) {
        $("[name=message]").val('');
        $("#submitForm").removeAttr('disabled');
        console.log('sent', message);
    });
});

var locationButton = $("#sendLocation");
locationButton.on('click', function () {
    if( ! navigator.geolocation) {
        return alert('No geolocation service available in your browser');
    }

    locationButton.attr('disabled', 'disabled').text('Sending location...');

    navigator.geolocation.getCurrentPosition(function (position) {
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, function() {
            locationButton.removeAttr('disabled').text('Send location');
        })
    }, function () {
        return alert('Unable to fetch location');
    })
});