//Simple extension
Object.prototype.extend = function(/* variable number of arguments */) {
	var args = Array.prototype.slice.call(arguments);
	for( var k in args ) {
		var push = typeof(arguments[k]) != "function" ? arguments[k] : {};
		for(var k in push)
			this[k] = (k != 0 && this[k] ? this[k] : push[k]);
	}
};	

var Scene = function(characters, options) {
	options = options || {};
	
	characters.sceneSpeed = options.speed || {
		x: function() { return 0 },
		y: function() { return 0 }
	};
	this.go = function(callback) {
		var t = 0,	//Restricted to closure to potentially allow simultaneous scenes
			inter;
		handleKeyPresses();
		inter = setInterval(function() {
			ctx.clearRect(0,0,1000,1000);					
			characters.move(t), characters.draw(t);
			t++;				
		}, 30);
		
		callback && callback(inter);
	};
};