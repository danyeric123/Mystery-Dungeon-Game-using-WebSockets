var Genie = {
	name: 'WebSocket Genie',
	beginning: function() {
	"use strict";
		Genie.speak(
			"Hey, this is a multiplayer text-based game" +
			"that uses WebSockets. Web Sockets is a web device that" +
			"defines a full-duplex communication channel that operates through a single \'socket\'" +
			"over the Web. It represents a colossal advance, especially for real-time, event-driven web applications" +
			"Normally when a browser visits a web page, an HTTP request is sent to the web" +
			"server that hosts that page.  The server receives this request and sends back information" +
			"This would mean that there would have to be a back and forth between the server and client" +
			"But in many cases—for example, for stock prices, news reports, ticket sales," +
			"traffic patterns, medical device readings, and so on—the response could be old" +
			" by the time the browser renders the page. In theory this could be fixed by" +
			"constantly refreshing that page manually, but that can be tiring and creates a lag in the flow of information" +
			"Since web applications had grown up a lot and we're now consuming more data than ever before," +
			"better solutions to meet our needs" +  
			" The biggest thing holding them back was the traditional HTTP model of client" + 
			"initiated transactions. To overcome this a number of different strategies were" + 
			"devised to allow servers to push data to the client. One of the most popular of" +
			"these strategies was long-polling. This involves keeping an HTTP connection open" +
			" until the server has some data to push down to the client" +
			"The problem with all of these solutions is that they carry the overhead of HTTP" + 
			"Every time you make an HTTP request a bunch of headers and cookie data are" + 
			"transferred to the server. This can add up to a reasonably large amount of data" +
			" that needs to be transferred, which in turn increases latency. If you’re" +
			"building something like a browser-based game, reducing latency is crucial to" +
			"keeping things running smoothly. The worst part of this is that a lot of these" +
			"headers and cookies aren’t actually needed to fulfil the client’s request" +
			"This is where WebSockets comes in. WebSockets on the other hand keeps a constant" +
			" connection and gives the client up-to-date data. It reduces latency and replaces long-polling." +
			"What makes Web Sockets even better is that it removes the overhead and" +
			"dramatically reduces complexity compared to other \"solutions\" like Comet" +
			" only Google's Chrome browser supports HTML5 Web Sockets natively, but other" + 
			"browsers will soon follow. There are things that try to work around that limitation, however," + 
			" and provide a complete WebSocket emulation for all the older" + 
			"browsers (I.E. 5.5+, Firefox 1.5+, Safari 3.0+, and Opera 9.5+), so you can start" +
			" using the HTML5 WebSocket APIs today"
		);
	},
	joining: function() { 
	"use strict";
		Genie.speak(
			"As you see, the system tells you when you (or any other player)" +
			" join the game. Try opening the game in another tab and come back to this tab to see what happens" +
			" then close it. You will see that the system also tells you when someone leaves" +
			" This is accomplished through an \'onrequest\' event handler on the WebSocket server" +
			" which sends back to the client a message telling him when someone joins and" +
			"an \'onclose\' event handler on the socket which does the same when someone leaves" +
			"To establish a WebSocket connection, the client and server upgrade from" +
			"the HTTP protocol to the WebSocket protocol during their initial handshake"
		);
	},
	talk: function() { 
	"use strict";
		Genie.speak(
			"Keep the other tab of the game open. Try to type" +
			"\'talk\' and something you would like to tell youself. It's like a chat, isn't it?" +
			" WebSockets can be trivially used for chat services. In the case of this game," +
			"you can only chat with people within the same room as you. Try to move to a" +
			"different room in this tab. (You must play the game to figure out how to move to next room.)"
		);
	},
	differentRoom: function() { 
	"use strict";
		Genie.speak(
			"Now that you are in a different room try to talk" +
			"to your other tab and see whether it can hear you. I'll save you the time--it can't" +
			" The server keeps track of what room you are in by setting the \'place\' of the JSON object that represents" +
			"you on the server to this new room, and then tells the client code who is in the room with you" +
			" Hence the Websocket not only deals with texts, but also JSON objects." + 
			"Once you know who's in your room the method that sends the message to other players," +
			"checks whether they are in the same room as you--in this case you are all alone"
		);
	},
	cons: function() { 
	"use strict";
		Genie.speak(
			"Some cons to the WebSocket web device: It requires" +
			" one to close and reopen the server every time you can the server code. This became" +
			"very frustrating. If something is wrong with your product, you must close up shop" +
			"for a bit till it is fixed. Clients will absolutely hate that. Another frustrating" +
			"aspect is that the whole socket stops working if there is a bug in the server code" +
			"This means any mistake you make doesn't have an effect on the immediate goal you had" +
			"in mind, but to the whole functionality of the WebSocket. It's a \"get it right the first" +
			" time\" kind of thing"
		);
	},
	betterGame: function() { 
	"use strict";
		Genie.speak(
			"An issue with the game at the moment is that Players A and B can both be in " +
			"wakingUp2.  Each one decides to knock out the guard, and both of them could " +
			"wind up with a dagger,  i.e. even though only one player knocking out the guard " +
			"the other player also gets the dagger too, which is odd since there is only one dagger." +
			"Similarly A might snaps off the key in the lock, but when B tries to open " +
			"the door there will be a key for him and the lock will be intact. Both these " +
			"situations are odd and should be prevented. A shared gaming state should exist " +
			"for both players--if one takes the key the other does not get it, for example." +
			"A solution to this problem would be either to create a JSON object on the server" +
			" to keep track of the game state, or to move many of the files server-side" +
			"The former might be easier short-term since it requires writing a couple lines " +
			"here and there to incorporate such a JSON object, but it might make things messy " +
			"and long since the server would have to handle a lot of different game states being sent " +
			"and making it easy for each player to know the general game state, while still " +
			"having their own gaming experience. Long term, it would be easier to move many " +
			"of the files to the server side since the game could be expanded as much as we " +
			"please incorporating many new features. Short term, this would be frustrating " +
			"and long requiring multiple files being connected to the main server file, which "+
			"is annoying since one loses much of the flexibility and locality of many functions/variables " +
			"of your object."
		);
	},
	
	speak: function(message) {
		"use strict";
		Game.writeToContainer(Genie.name, message);
	}
	
};