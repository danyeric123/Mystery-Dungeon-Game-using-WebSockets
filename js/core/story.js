var message = '',
	coplayers,
	gameChange = {"loss": '', 
				  "move": '', 
				  "story": ''};
//This deals with the story arch of the game. Each part of the game is a different function
var Story = {
    tutorial:function() { 
    "use strict";
        Game.changeGameStatus('Tutorial', 'message');
        Game.clearTextContainer();
		Genie.beginning();
        Game.writeToContainer('Tutorial', 'To play this game you just need to enter one of the words or phrases given. The choices you make could impact your win or loss, so choose wisely. If you click the inventory button above the game will print out the items you currently have. Typing the items name will show a description of that item. To begin and move onto the game please type "continue" or type "credits" to see the credits for this game and then press enter.');
        Commands.registerCommand('continue', function() { 
            Commands.unregisterCommand('continue');
            Story.wakingUp();
        });
        Genie.joining();
    },
    
   //The beginning of the game
    wakingUp:function() { 
    "use strict";
        Game.changeGameStatus('Waking Up', 'message');
        Game.gameSave('wakingUp');
    //    console.log(Player.room);
        
        Game.clearTextContainer();
        Game.writeToContainer('', 'You wake up with a hurting head and see an opening in the ceiling. After carefully standing up you notice a door infront of you. Do you want to \'walk to door\', \'look at ceiling\' or \'search room\'?');
        Genie.talk();
        
        Commands.registerCommand('search room', function() { 
            Game.writeToContainer('', 'You search the room and find a key. What is this used for?');
            Player.addToInventory('key');
            Commands.unregisterCommand('search room');
        });
        
        Commands.registerCommand('walk to door', function() { 
            if (Player.checkInventory('key')) {
                Game.writeToContainer('', 'The key snaps, but the door still opens.');
                Player.removeFromInventory('key');
                Commands.unregisterCommand('walk to door');
                setTimeout(function() {
                    Story.wakingUp2();
                    clearTimeout();
                }, 2000);
            } else {
                Game.writeToContainer('', 'You walk up to the door but it is locked.');
            }
        });
        
        Commands.registerCommand('look at ceiling', function() { 
            Game.writeToContainer('', 'You look up at the ceiling and see a large hole. You think you might have fallen through the whole and then gone unconcious.');
            Commands.unregisterCommand('look at ceiling');
        });        
        
    },
    
    wakingUp2: function() { 
    "use strict";
        Game.changeGameStatus('Waking Up Part 2', 'message');
        Game.gameSave('wakingUp2');
        Game.clearTextContainer();
        Game.writeToContainer('', 'You slowly walk forward and then see a guard standing in front of you, facing the other way. You can either \'knock him out\' or \'sneak past\' him');
       	socket.send('wakingUp2');
       	Genie.differentRoom();
        
        Commands.registerCommand('knock him out', function() { 
            message = 'You continue to walk slowly up to the guard and succesfully knock him out. You then pick up his dagger.';
            coplayers = Player.getCoplayers();
            if(coplayers.length < 2) {
            	gameChange.loss = 2;
            	socket.send(JSON.stringify(gameChange));
            	message = message + 'You take damage of 2';
            }
            else{
            	message = message + 'You and your friend take no damage. You overpowered him!';	
            }
            gameChange.story = message;
            socket.send(JSON.stringify(gameChange));
            clearState();
           //  console.log(coplayers);
            Player.addToInventory('dagger');
            Commands.unregisterCommand('knock him out');
            setTimeout(function() { 
                gameChange.move = "theChoice";
                socket.send(JSON.stringify(gameChange));
                clearState();
                clearTimeout();
            }, 2000);
        });
        
        Commands.registerCommand('sneak past', function() {        
            Game.writeToContainer('', 'You crouch and move silently towards the guard, you trip on one of the cracks in the stone floor and stumble into him. Shockingly enough the guard pulls out his sword and severs your head from your body.');
            Commands.unregisterCommand('sneak past');
            setTimeout(function() {
                Game.die();
                clearTimeout();
            }, 3000);
        });
        
        
    },
    
    theChoice: function() { 
    "use strict";
        Game.changeGameStatus('The Choice', 'message');
        Game.gameSave('theChoice');
        Game.clearTextContainer();
        Game.writeToContainer('', 'You start to walk forward being as quiet as you can. Then you see three passages. \'left\',\'right\' or \'straight\'');
        socket.send('theChoice');
        
        Commands.registerCommand('left', function() { 
            Game.writeToContainer('', 'You turn left but it is a dead end.');
            Commands.unregisterCommand('left');
        });
        
        Commands.registerCommand('right', function() { 
            if (!Player.checkInventory('key')) {
				Game.writeToContainer('', 'You turn right and see a door. But it is locked.');
            }else{
            	Game.writeToContainer('', 'The key snaps, but the door still opens.');
                Player.removeFromInventory('key');
            	setTimeout(function() { 
					Story.treasureRoom();
					clearTimeout();
				}, 2000);
            }
            Commands.unregisterCommand('right');
        });
        
        Commands.registerCommand('straight', function() {
            Game.writeToContainer('', 'You go straight on a start to see a prison. After you keep walking you enter a large room.');
            Commands.unregisterCommand('straight');
            setTimeout(function() {
                Story.prison1();
            }, 2000);
        });
        
        
    },
    
    prison1: function() { 
    "use strict";
        Game.changeGameStatus('Prison', 'message');
        Game.gameSave('prison1');
        Game.clearTextContainer();
        Game.writeToContainer('', 'Inside the large room you see a large guard. You can either \'fight him\' or \'sneak past\'');
        socket.send('prison1');
        
        Commands.registerCommand('fight him', function() { 
			if(Player.checkInventory('dagger')) {
				message = 'You engage in combat with the guard. He gets a few hits in but ';
				coplayers = Player.getCoplayers();
				if(coplayers.length < 2) {
					message = message + 'you manage to fend him off with your dagger before plunging it into his heart. The dagger has bent upon contact of the guards armour and is now useless. You lose 2 attack and 3 health.';
					gameChange.loss = 3;
					console.log(Player.coplayers.length);
				}
				else{
					message = message + 'one of you attacks him from behind, while the other stabs him straight in the heart. You and your friend take 1 damage. You overpowered him with little damage!';
					socket.send("loss of " + 1  + " move to prison2");
				}
				gameChange.story = message;
				socket.send(JSON.stringify(gameChange));
				clearState();
				Player.removeFromInventory('dagger');
				setTimeout(function() { 
					gameChange.move = "prison2";
					socket.send(JSON.stringify(gameChange));
					clearState();
				}, 3000);
			} else {
				Game.die();
			}
        });
        
        Commands.registerCommand('sneak past', function() { 
            Game.writeToContainer('', 'You hug the wall and start to slowly make your way past the guard. All goes well until you clumsily knock over one of the pots decorating the room. The guard turns and swiftly calls for reinforcements. Five arrows come zipping out of nowhere, pinning you to the wall by your organs. ');
            setTimeout(function() {
                Game.die();
                clearTimeout();
            }, 6000);
        });
        
    },
    
    prison2: function() { 
    "use strict";
        Game.changeGameStatus('Prison Part 2', 'message');
        Game.gameSave('prison2');
        Game.clearTextContainer();
        Game.writeToContainer('', 'You stand up from stabbing the guard in the heart. You can \'search room\' or \'search guard\'.');
        socket.send('prison2');
        
        Commands.registerCommand('search guard', function() { 
            Game.writeToContainer('', 'You search the guard, in one of his pockets you find a small brass key.  The sound of distant footsteps can be heard approaching.');
            Player.addToInventory('key');
            setTimeout(function(){
                Story.prison3();
                clearTimeout();
            }, 3000);
		  });
        
        Commands.registerCommand('search room', function() { 
            Game.writeToContainer('', 'You search the room thoroughly and manage to find a half eaten piece of bread inside of a very large basket. You can eat the bread by typing \'eat bread\'');
            Player.addToInventory('bread');
        });
        
    },
    
    prison3: function() { 
    "use strict";
        Game.changeGameStatus('Prison Part 3', 'message');
        Game.gameSave('prison3');
        Game.writeToContainer('', 'You can either \'hide in basket\' or \'return to hallway\'');
        socket.send('prison3');
        
        Commands.registerCommand('hide in basket', function(){
            Game.writeToContainer('', 'You hide in the large basket and the guard spots the dead body and runs off shouting. You can now \'return to hallway\'');
       
            Commands.registerCommand('return to hallway', function() { 
                Commands.clearRegisteredCommands();
                message = 'More guards come. You must fight them!';
                coplayers = Player.getCoplayers();
				if(coplayers.length < 4) {
					message = message + 'You were brave, but they overpowered you and killed you';
					Game.writeToContainer('', message);
					setTimeout(function() {
						Game.die();
						gameChange.loss = 10;
						socket.send(JSON.stringify(gameChange));
						clearState();
						clearTimeout();
					}, 3000);
				}
				else{
					message = message + 'You all come as a group and fend off the guards. Each of you takes a damage of 3.';	
					gameChange.loss = 3;
					gameChange.story = message;
					gameChange.move = "theChoice";
					socket.send(JSON.stringify(gameChange));
					clearState();
				}
				console.log(Player.coplayers.length);
            });
            
        });
        
        Commands.registerCommand('return to hallway', function() { 
            message = 'You see a guard. Kill him before he tells his friends what you did!';
            Game.writeToContainer('', message);
            coplayers = Player.getCoplayers();
			if(coplayers.length < 2) {
				message = 'You have nothing to attack him with! He kills you easily.';
				Game.writeToContainer('', message);
				setTimeout(function(){
					Game.die();
					clearTimeout();
				}, 3000);
			}
			else{
				message ='One of you attacks him from behind, while the other strangles him. You and your friend take 1 damage. You overpowered him with little damage!';	
//				console.log(coplayers.length);
				gameChange.loss = 1;
				gameChange.story = message;
				socket.send(JSON.stringify(gameChange));
				clearState();
				setTimeout(function(){
					gameChange.move = "theChoice";
					socket.send(JSON.stringify(gameChange));
					clearState();
					clearTimeout();
				}, 3000);
			}
        });
        
    },
    
    treasureRoom: function() { 
    "use strict";
    	alert("You win!");
    	Game.clearInputBox();
        Game.clearTextContainer();
        localStorage.clear();
        Commands.clearRegisteredCommands();
        Genie.cons();
        Genie.betterGame();
        Game.writeToContainer('system', 'Wanna play again? Type \'restart\' to restart the game.');
        Commands.registerCommand('restart', function() { 
            Commands.unregisterCommand('restart');
            location.reload();
        });
    }
};

function clearState() {
	gameChange.story = '';
	gameChange.move = '';
	gameChange.loss = '';
}