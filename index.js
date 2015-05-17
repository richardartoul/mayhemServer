var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var websites = {};

app.get('/', function(req,res) {
	res.send("Hello World");
});

io.on('connection', function(socket) {
	console.log("A user connected");
	socket.on("playerUrl", function(playerUrl) {
		/* its probably really inefficient to use website urls as keys to an object.
		An easy short-term solution would be use a hasing function client side
		to convert the urls to a simpler key, but this would result in collissions
		eventually and its own host of issues*/  
		if (!websites[playerUrl]) {
			websites[playerUrl] = {};
		}
		// websites[playerUrl][player]
	});
	socket.on("playerLocation", function(playerObj) {
		console.log(playerObj);

	});
	socket.on('discconect', function() {
		console.log("A user disconected");
	});
});

http.listen(3000, function() {
	console.log("listening on *:3000");
});