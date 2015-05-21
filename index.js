var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

//needs to be refactored into a custom data structure
var websites = {};
var users = {};

io.on('connection', function(socket) {
	console.log("A user connected");
	socket.on("playerUrl", function(urlObj) {
		/* its probably really inefficient to use website urls as keys to an object.
		An easy short-term solution would be use a hashing function client side
		to convert the urls to a simpler key, but this would result in collissions
		eventually and its own host of issues*/  
		if (!websites[urlObj.url]) {
			websites[urlObj.url] = [];
		}
		
		websites[urlObj.url].push(urlObj.player);

		users[urlObj.player] = {
			socket:socket,
			url: urlObj.url,
			shipData: undefined
		} 

	});
	socket.on("playerLocation", function(playerObj) {
		if(users[playerObj.player]) {
			playerUrl = users[playerObj.player].url;
			users[playerObj.player].shipData = playerObj;
			for (var i = 0; i < websites[playerUrl].length; i++) {
				users[websites[playerUrl][i]].socket.emit('otherPlayerLocation', playerObj);
			}
		}
	});
	socket.on('discconect', function() {
		console.log("A user disconected");
	});

	socket.on('error', function(error) {
		console.log(error);
	});
});

http.listen(3000, function() {
	console.log("listening on *:3000");
});