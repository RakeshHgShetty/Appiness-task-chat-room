var express = require('express')
var app = express()
var server = require('http').createServer(app)
var io = require('socket.io').listen(server)
var fs = require('fs')

server.listen(process.env.PORT || 3000, function() {
    console.log("listening on * 3000")
})

var clientDirectory = __dirname + '/public'
app.use(express.json());
app.get('/', function(req, res) {
    res.sendFile(__dirname + "/login.html")
})

var path = require("path");
app.use(express.static(path.join(__dirname, 'public')));

var mongoClient = require('mongodb').MongoClient;
var dbUrl = 'mongodb://localhost:27017/test'

connection = []
users = []
io.sockets.on("connection", function(socket) {
    connection.push(socket)
    console.log("connected:", connection.length)

    //Disconnect      
    socket.on("disconnect", function(data) {
        users.splice(users.indexOf(socket.username), 1)
        updateUserNames();
        connection.splice(connection.indexOf(socket), 1)
        console.log("User is disconnected");

    });
    // New message
    socket.on("send message", function(data) {
        io.sockets.emit('new message', { msg: data, user: socket.username })
    });

    //New user
    socket.on("new user", function(data, cb) {
        cb(true)
        socket.username = data;
        users.push(socket.username);
        updateUserNames()
    });

    function updateUserNames() {
        io.sockets.emit('get users', users)
    }

})


app.post('/user', function(req, res) {
    mongoClient.connect(dbUrl, function(err, client) {
        if (err) {
            console.log("Error while fetching the DB data", err)
        } else {
            console.log("Sucessfully connected")
            client.collection('user').find({
                user_name: req.body.user_name,
                password: req.body.password
            }).toArray(function(err, docs) {
                client.close();
                if (docs.length !== 0) {
                    res.json({
                        status: 'success',
                        dataPresent: true,
                        userName: req.body.user_name
                    });
                } else {
                    res.json({
                        status: 'failed',
                        dataPresent: false
                    });
                }
            })
        }
    })

});


app.post('/register', function(req, res) {
    mongoClient.connect(dbUrl, function(err, client) {
        if (err) {
            console.log("Error while fetching the DB data", err)
        } else {
            console.log("Sucessfully connected");
            client.collection('user').insert({
                user_name: req.body.user_name,
                password: req.body.password,
                place: req.body.place,
                email_address: req.body.email_address
            }, function(err, user) {
                if (err) {
                    res.json({
                        status: 'failed',
                        user: null
                    });
                } else {                   
                    res.json({
                        status: 'success',
                        user: user
                    });
                }
            });
        }
    });
});


app.get('/chat', function(req, res) {

    res.sendFile(__dirname + "/public/chat-room.html")

})