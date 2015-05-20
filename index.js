var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var websites = {};
var users = {};

app.get('/', function(req,res) {
	res.send("Hello World");
});

io.on('connection', function(socket) {
	console.log("A user connected");
	socket.on("playerUrl", function(urlObj) {
		/* its probably really inefficient to use website urls as keys to an object.
		An easy short-term solution would be use a hasing function client side
		to convert the urls to a simpler key, but this would result in collissions
		eventually and its own host of issues*/  
		if (!websites[urlObj.url]) {
			websites[urlObj.url] = [];
		}
		
		websites[urlObj.url].push(urlObj.player);

		users[urlObj.url] = {
			socket:socket,
			url: urlObj.url,
			shipData: undefined
		} 
		console.log(urlObj.url," array contains", websites[urlObj.url]);
		// websites[playerUrl][player]
	});
	socket.on("playerLocation", function(playerObj) {
		// console.log(playerObj);
		//do I even need to store these?
		playerUrl = users[playerObj.player].url;
		users[playerObj.player].shipData = playerObj;
		for (var i = 0; i < websites[playerUrl].length; i++) {
			websites[playerUrl][i].socket.emit('otherPlayerLocation', playerObj);
		}
	});
	socket.on('discconect', function() {
		console.log("A user disconected");
	});
});

http.listen(3000, function() {
	console.log("listening on *:3000");
});