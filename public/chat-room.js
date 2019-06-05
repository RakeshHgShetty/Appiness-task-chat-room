$(function() {
    var socket = io.connect();
    var $messagesForm = $('#messagesForm');
    var $chat = $('#chat');
    var $message = $('#message');
    var $userNameArea = $('#userNameArea')
    var $UserNameForm = $('#UserNameForm')
    var $UserNameMessage = $('#UserNameMessage');
    console.log($UserNameMessage.val())
    var $onlineUsers = $('#onlineUsers');
    var $onlineUsersArea = $('#onlineUsersArea');


    $messagesForm.submit(function(e) {
        e.preventDefault()
        socket.emit('send message', $message.val())
        $message.val('')
    })

    socket.on('new message', function(data) {
        $chat.append('<div class ="well"><strong>' + data.user + '</strong> :' + data.msg + "</div>")
    })

    $UserNameForm.submit(function(e) {
        e.preventDefault()
        socket.emit('new user', $UserNameMessage.val(), function(data) {
            console.log("data", data)
            if (data) {
                $userNameArea.hide();
                $onlineUsersArea.show();
            }

        })
        $UserNameMessage.val('')
    })

    socket.on('get users', function(data) {
        console.log(data)
        var html = '';
        for (let i = 0; i < data.length; i++) {
            html += '<li class="list-group-item">' + data[i] + '</li>';
        }
        $onlineUsers.html(html);
    })

})