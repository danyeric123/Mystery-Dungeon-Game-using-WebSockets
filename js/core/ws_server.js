#!/usr/bin/env node

var WebSocketServer = require('websocket').server,
	http = require('http'),
	//I created a JSON object that keeps track of all the players happenings
	players = {"players": []};

//creates the server, then gives it a port and initializes it as a WebSocket
var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});
server.listen(8080, function() {
    console.log((new Date()) + ' Server is listening on port 8080');
});
var wsServer = new WebSocketServer({ httpServer: server });


/*Here the connections, connection ids, and the allowed places are saved. The utility of 
having a list of allowed places the player can go prevents the client from messing with the 
code and cheating */
var connections = {},
	connectionIDCounter = 0,
	places = ["wakingUp2", "theChoice", "prison1", "prison2", "prison3" , "treasure"];

/*The below code deals with when a new WebSocket is created. Most of the information is 
related to the console on the server. Additionally, a new player is created when a new 
WebSocket is created. */
wsServer.on('request', function(request) {
    
    var connection = request.accept(null, request.origin);

    // Store a reference to the connection using an incrementing ID
    connection.id = connectionIDCounter ++;
    connections[connection.id] = connection;
     var player = { "name": "Player"+(connection.id+1),
     				"id": connection.id,
     				"place": "wakingUp",
     				"command": "",
     				"message": ""
    			   }
    players.players.push(player);
    console.log(connection.id);;
     console.log(players);
/* the below code deals with messages being sent from the client to the server. Since there
 are many different messages the client can send the below code deals with it. A JSON object 
 is dealt with one way; the person's location another; and a plain text message another */    
    connection.on('message', function (message) {
		if (message.type === 'utf8') {
			console.log("Connection " + connection.id + " received: " + message.utf8Data);
			//sendToCoplayers(player, (player.name + ": " + message.utf8Data));
		}
		if (places.indexOf(message.utf8Data) >= 0) {
			player.place = message.utf8Data;
			console.log(player.name + " is in " + player.place);
			playersInRoom(connection.id);
		}
		else if (message.utf8Data.indexOf("{") > -1){
			sendToCoplayers(player, message.utf8Data);
			console.log(message.utf8Data);
		}
		else {
			player.message = message.utf8Data;
			sendToCoplayers(player, JSON.stringify(player));
		}
    });
    // Now you can access the connection with connections[id] and find out
    // the id for a connection with connection.id
    
    console.log((new Date()) + ' Connection ID ' + connection.id + ' accepted.');
    broadcast("Player " + (connection.id+1) + " just joined");
    connection.on('close', function() {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected. ' +
                    "Connection ID: " + connection.id);
        broadcast("Player " + (connection.id+1) + " just left" );
        // Make sure to remove closed connections from the global pool
        delete connections[connection.id];
       	delete players.players[connection.id];
    });
});

/*Broadcast to all open connections; used mostly to tell the players when someone starts 
the game or leaves it */
function broadcast(data) {
    Object.keys(connections).forEach(function(key) {
        var connection = connections[key];
        if (connection.connected) {
            connection.send(data);
        }
    });
}

/* the below code deals with how many players are playing the game. In theory there might
be a use for it, but as it stands, nothing in the game depends on it. Left in the code to 
just demonstrate how it would be done

function playerAmount() {
	var i = 0;
	Object.keys(connections).forEach(function(key) {
        var connection = connections[key];
        if (connection.connected) {
            i++;
        }
    });
    broadcast(i);
} */

/* This function keeps track of who is in a given player's room and who isn't. It sends a
message to all the players that are not in the room that this player is not in the room.
It also informs others when a given player enters the room. */
function playersInRoom(connectionID) {
	var thisPlayer = players.players[connectionID],
		inRoom = {"players":[]},
		otherPlayer;
	for(var i=0; i < players.players.length; i++) {
		otherPlayer = players.players[i];
		if(otherPlayer) {
			if(thisPlayer.place == otherPlayer.place) {
				inRoom.players.push({"name":otherPlayer.name});
			}else{
				sendToCoplayers(otherPlayer, JSON.stringify({"leftRoom":thisPlayer.name}));
			}
		}
	}
    sendToCoplayers(thisPlayer, JSON.stringify(inRoom));
    console.log(inRoom);
}

// Send a message to a connection by its connectionID
function sendToConnectionId(connectionID, data) {
    var connection = connections[connectionID];
    if (connection && connection.connected) {
        connection.send(data);
    }
}

//Sends a message to the other players in the room
function sendToCoplayers(thisPlayer, data) {
	var otherPlayer;
	for(var i=0; i < players.players.length; i++) {
		otherPlayer = players.players[i];
		if(otherPlayer) {
			var connection = connections[i];
			if((thisPlayer.place == otherPlayer.place) && connection) {
				connection.send(data);
			}
		}
	}
}