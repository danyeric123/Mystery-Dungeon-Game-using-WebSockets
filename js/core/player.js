/* The below code deals with creates the WebSocket for the client side to deal with.
An event listener is added to the socket to deal with messages sent to the client from 
the server. Each is dealt with different. Look at the server code's event listener for 
messages to understand how this one is built. */
var socket;
socket = new WebSocket("ws://localhost:8080");
socket.addEventListener("message", function(event) {
        "use strict";
        var args = event.data.split(" ").slice(1).join(" ");
        if(args.indexOf("just") > 0){
        	Game.writeToContainer("System", event.data);
        }
        else if(event.data.indexOf("{") > -1) {
			var jsonObject = JSON.parse(event.data);
			if(jsonObject.players){
				Player.addCoplayer(jsonObject);
			}else if(jsonObject.leftRoom){
				Player.deleteCoplayer(jsonObject);
			}else if(jsonObject.message){
				Game.writeToContainer(jsonObject.name, jsonObject.message);
			} else if(jsonObject.story) {
				Game.writeToContainer('', jsonObject.story);
			} else if(jsonObject.move) {
				Story[jsonObject.move]();
			} else if(jsonObject.loss) {
				Player.changeHealth("decrease", jsonObject.loss);
			}
        }
        });
 
/*This is the player object. It has several functions and it keeps track of the player's
health, attack, items and coplayers */        
var Player = {
    health      : 10,
    attack      : 3,
    items       : [],
    room		: '',
    coplayers	: [],
    
    changeHealth: function(way, num) {
       "use strict";
        if (way === 'increase') {
            Player.health = parseInt(Player.health) + parseInt(num);
        } else if (way === 'decrease') {
            if (Player.health === 1 || (Player.health - num) < 1) {
                Game.die();
            } else {
                Player.health = parseInt(Player.health) - parseInt(num);
            }
        }
        $(Game.healthContainer).html(Player.health);
    },
    
    
    
    displayInventory: function() { 
    "use strict";
        var content = [];
        
        if (Player.items.length < 1) {
            content.push('<table class="table table-hover table-bordered"><thead><tr><td>Image</td><td>Item Name</td><td>Item Description</td></tr></thead><tbody><tr><td></td><td>You have no items in your inventory</td></tr></tbody></table>');
        } else {
            content.push('<table class="table table-hover table-bordered"><thead><tr><td>Image</td><td>Item Name</td><td>Item Description</td></tr></thead><tbody>');
            for (var i = 0; i < Player.items.length; i++) {
                var itemm,
                	item;
                if (Items[Player.items[i]]) {
					item = Player.items[i].replace(' ', '_');
                    itemm = Player.items[i];
                } else {
                    item = 'notfound';
                    itemm = 'notfound';
                }
                content.push('<tr><td><img src="images/items/'+itemm+'.png" width="48px" height="48px"></td><td>'+Player.items[i]+'</td><td>'+Items[item]+'</td></tr>');
            }
            content.push('</tbody></table>');
        }
        
        bootbox.dialog({
            message: content.join('\n'),
            title: "Inventory",
            buttons: {
                main: {
                    label: "Close",
                    className: "btn-primary"
               }
            }
        });
        
        
    },
    
    addToInventory: function(item) {
    "use strict";
        Player.items.push(item);
        Game.changeGameStatus('You picked up '+item, 'update');
    },
    
    checkInventory: function(item) {
    "use strict";
        if($.inArray(item, Player.items) > -1) {
            return true;
        } else {
            return false;
        }
    },
    
    removeFromInventory: function(item) {
   	"use strict";
        Player.items.remove(item);
        Game.changeGameStatus('You used '+item, 'update');
    },
    
    addCoplayer: function(data) {
	"use strict";
		Player.coplayers = [];
		for(var i=0; i < data.players.length; i++) {
			Player.coplayers.push(data.players[i]);
			console.log(data.players[i]);
		}
		console.log(Player.coplayers);
    },
    
    deleteCoplayer: function(data) {
    "use strict";
    	for(var i = 0; i < Player.coplayers.length; i++) {
    		if(Player.coplayers[i].name == data.leftRoom) {
    			Player.coplayers.pop(i);
    			console.log("something");
    		}
    	}
    	console.log(data);
    },

//When the player wants to speak to his coplayers
    talk: function(message) {
    "use strict";
    	socket.send(message); 
        },
    getCoplayers: function() {
    	return Player.coplayers;
    },
};