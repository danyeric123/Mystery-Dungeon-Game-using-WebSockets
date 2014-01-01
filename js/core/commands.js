/* This file deals with the commands that the player sends the game. There are global 
commands and local (i.e. local to room) commands. For the local commands, the file sets 
the command and then when the player leaves the room, the command is unregistered--hence 
the unregister function */
var Commands = {
    globalCommands: [
        'shrink sidebar',
        'expand sidebar',
        'die',
        'show credits',
        'eat bread',
        'save game',
        'talk'
    ],
    
    registeredCommands: [],
    
    registerCommand: function (command, commandFunction) {
    "use strict";
        Commands.registeredCommands.push(command);
        command = command.replace(/ /g, '');
        Commands[command] = commandFunction;
        console.log('[Game Debugging] '+command+' has been registered');
    },
    
    unregisterCommand: function (command) {
    "use strict";
        delete Commands[command];
        Commands.registeredCommands.remove(command);
        console.log('[Game Debugging] '+command+' has been unregisterd');
    },
    
/*Checks whether the command is a local or global command otherwise tells the player that 
it isnt a command */
    runCommand: function (command, args) {
    "use strict";
        var newCommand = command.replace(/ /g, '');
        if ($.inArray(command, Commands.registeredCommands) > -1 || $.inArray(command, Commands.globalCommands) > -1) {
            args ? Commands[newCommand](args) : Commands[newCommand]();
        } else {
            console.log('[Game Debugging] '+command + ' is not a registered command!');
        }
    },
    
    clearRegisteredCommands: function() {
    "use strict";
        for (var i = 0; i < Commands.registeredCommands.length; i++) {
            var command = Commands.registeredCommands[i];
            delete Commands[command];
            Commands.registeredCommands.remove(command);
            console.log('[Game Debugging] '+command+' has been unregisterd.');
        }
    },
    
    // Global Commands
    die: function() {
    "use strict";
        Game.die();
    },
    
    shrinksidebar: function() {
    "use strict";
        Game.shrinkSidebar();
    },
    
    expandsidebar: function() {
    "use strict";
        Game.expandSidebar();
    },
    
    showcredits: function() {
    "use strict";
        Credits.show();
    },
    
    eatbread: function() {
    "use strict";
        if (Player.checkInventory('bread')) {
            Player.changeHealth('increase', 3);
            Game.writeToContainer('system', 'You eat the bread and gain 3 health');
            Player.removeFromInventory('bread');   
        } else {
            Game.writeToContainer('system', 'You have no bread to eat.');
        }
    },
  	talk: function(message) {
  	"use strict";
    	 Player.talk(message);
    	 console.log(message);
    }
};