var Hapi = require('hapi');
var Ws = require('ws');

var webSockets = [];
var server = new Hapi.Server(8889);

server.start(function () {
    console.log("Server started, type to send message, type vibrate to make watches vibrate");

    var ws = new Ws.Server({ server: server.listener });
    ws.on('connection', function (socket) {
	console.log("Watch connected, sent welcome message");
        socket.send('Welcome PebbleBE');

	    socket.on('message', function(data, flags) {
			    console.log("received message: ", data);
			    // flags.binary will be set if a binary data is received.
			    // flags.masked will be set if the data was masked.
			    });

	    socket.on("close", function () {
		console.log("websocket connection closed");
	    });
    });

    webSockets.push(ws);
});


process.stdin.on('data', function (data) {
    console.log("sending to connected clients");

    transmit(data)
});

var transmit = function (data) {

    try {
        webSockets.forEach(function (ws) {

            if (!ws || !ws.clients) {
                return;
            }

            for (var i = 0, il = ws.clients.length; i < il; ++i) {
                var client = ws.clients[i];
                if (client && client.send) {
                    client.send(data.toString());
                }
            }
        });
    }
    catch (err) {}
};

