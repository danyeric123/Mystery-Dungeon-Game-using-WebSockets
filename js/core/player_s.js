exports.player =  {
			health      : 10,
			attack      : 3,
			name        : '',
			items       : [],
			room		: '',

			changeHealth: function(way, num) {
				if (way === 'increase') {
					Player.health = parseInt(Player.health) + parseInt(num);
				} else if (way === 'decrease') {
					if (Player.health === 1) {
						Game.die();
					} else {
						Player.health = parseInt(Player.health) - parseInt(num);
					}
				}
				$(Game.healthContainer).html(Player.health);
			},
			addToInventory: function(item) {
				Player.items.push(item);
				Game.changeGameStatus('You picked up '+item, 'update');
			},
	
			checkInventory: function(item) {
				if($.inArray(item, Player.items) > -1) {
					return true;
				} else {
					return false;
				}
			},
	
			removeFromInventory: function(item) {
				Player.items.remove(item);
				Game.changeGameStatus('You used '+item, 'update');
			},
			
			setRoom: function(room) {
				this.room = room;
			},
			
			setName: function(name) {
				this.name = name;
			}
	}