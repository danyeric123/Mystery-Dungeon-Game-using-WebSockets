var Game = {
    version             : '1.0 Alpha',
	healthContainer		: '#health span',
	inputBox			: '#inputBox',
	textContainer		: '#textContainer',
    gameStateContainer  : '#gameStatus span',
    
	// Initializes/starts  game
	init: function() { 
	"use strict";
        if (localStorage.health && localStorage.sceneLocation) {
            Player.health = localStorage.health;
            Player.items = JSON.parse(localStorage.items);
            Story[localStorage.sceneLocation]();
		    $(Game.healthContainer).html(Player.health);
            $(Game.levelContainer).html(Player.level);
            $(Game.nameDisplay).html(Player.name);
        } else {
            $(Game.healthContainer).html(Player.health);
            $(Game.levelContainer).html(Player.level);
            Story.tutorial();
        }
       
        //Deals with player sending text via the textbox and pressing enter. 
        $(document).on('keypress', function(e) {
            if (e.which === 13 && $(Game.inputBox).val() !== '') {
                var input = $(Game.inputBox).val().toLowerCase(),
                	command = input.split(" ")[0];
                Game.clearInputBox();
                if ($.inArray(input, Commands.globalCommands) > -1 || $.inArray(input, Commands.registeredCommands) > -1) {
                    Commands.runCommand(input);
                } 
                else if ($.inArray(command, Commands.globalCommands) > -1 || $.inArray(command, Commands.registeredCommands) > -1) {
                    Commands.runCommand(command, input.split(" ").slice(1).join(" "));
                }
                else {
                    Game.writeToContainer('', input + ' is not a registered command!');
                }
            }
        });        
	},
    
    //When the player dies
    die: function() { 
    "use strict";
        Player.health = 0;
        $(Game.healthContainer).html(Player.health);
        Game.clearInputBox();
        Game.clearTextContainer();
        Player.items = [];
        localStorage.clear();
        Commands.clearRegisteredCommands();
        Game.changeGameStatus('You have died', 'message');
        Game.writeToContainer('system', 'You have died. All your items have been destroyed. Type \'restart\' to restart the game.');
        socket.close();
        Commands.registerCommand('restart', function() {
            Commands.unregisterCommand('restart');
            location.reload();
        });
    },
    
   //This places the game info to the game text container 
    writeToContainer: function(speaker, message) {
    "use strict";
        if (speaker) {
            speaker = speaker.toUpperCase();
            $(Game.textContainer).append('<p><strong>[' + speaker + ']</strong> : ' + message + '</p>');
        } else {
            $(Game.textContainer).append('<p>' + message + '</p>');
        }
        
    },
    
    //Bottom two functions deal with clearing the input box and text container
    clearInputBox: function() { 
    "use strict";
        $(Game.inputBox).val('');
    },
    
    clearTextContainer: function() { 
    "use strict";
        $(Game.textContainer).html('');
    },
    
    gameSave: function(sceneLocation) {
    "use strict";
        Game.changeGameStatus('Game Saved', 'update');
        localStorage.sceneLocation = sceneLocation;
        localStorage.health = Player.health;
        localStorage.items = JSON.stringify(Player.items);
    },
    
    changeGameStatus: function(status, type) {
    "use strict";
        if (type === 'message') {
            $(Game.gameStateContainer).html(status);
        } else if (type === 'update') {
            var previousInput = $(Game.gameStateContainer).html();
            $(Game.gameStateContainer).html(status);
            setTimeout(function() {
                $(Game.gameStateContainer).html(previousInput);
                clearTimeout();
            }, 1000);
        }  
    },
    
    shrinkSidebar: function() { 
    "use strict";
        $('#gameInfo').animate({
            'width':'5%'
        });
        $(Game.inputBox).animate({
            'width':'95%'
        });
        $(Game.textContainer).animate({
            'width':'95%'
        });
    },
    
    expandSidebar: function() { 
    "use strict"; 
        $('#gameInfo').animate({
            'width':'20%'
        });
        $(Game.inputBox).animate({
            'width':'80%'
        });
        $(Game.textContainer).animate({
            'width':'80%'
        });
    }

};

$(document).ready(function() { 
"use strict";
    
    //gives the player the inventory when the player presses the inventory button
    $('#inventory').on('click', function(e) {
        Player.displayInventory();
        e.preventDefault();
    });
        
    //Resets game when one presses the game reset button
    $('#gameReset').on('click', function(e) {
        bootbox.confirm('Are you sure you would like to delete your current game save?', function(result) {
            if(result) {
                localStorage.clear();
                location.reload();
            }
        });
        e.preventDefault();
    });    
    Game.init();
});