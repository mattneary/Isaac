keyCodes = {
	up: '&', left: '%', right: "'", down: '('
};

//Keyboard functions
var kkeys 	= {},
	isDown 	= function(cchar) {
		return kkeys[cchar];
	};
	
var handleKeyPresses = function() {
	window.onkeydown = (function(e) {				
		kkeys[String.fromCharCode(e.keyCode)] = true;	
		//Prevent beep
		return false;
	});
	window.onkeyup = (function(e) {
		kkeys[String.fromCharCode(e.keyCode)] = false;
	});	
};	//var inter;	//Animation Interval

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
};var Rect = function(options) {				
	this.extend(options, {
		width: options.size,
		height: options.size,
		color: "#000"
	});
};	var Character = function(parameters, spawn /*Pushes new character by default*/) {							
	this.extend(parameters, {
		shapes: [],
		title: "",
		speed: {x: Function('return 0'), y: Function('return 0')},
		collisions: {},
		offset: {
			x: 0, y: 0
		}
	});					
	if( spawn !== false ) characters[parameters.title] = this;				
};

Character.prototype = {
	shade: function() {		
		//Bulk drawing
		var text = this.text ? this.text() : '';
		(function(rects, offset, overrideColor) {
			for( var k in rects ) {
				var rect = rects[k];					
				
				ctx.fillStyle = overrideColor || rect.color;											
				ctx.fillRect(rect.x+offset.x, cvs.height-(rect.y+offset.y), rect.width, rect.height);		
				
				ctx.font         = 'italic 30px sans-serif';
				ctx.textBaseline = 'top';
				if( text )
					ctx.fillText(text, rect.x+offset.x, cvs.height-(rect.y+offset.y));
			}
		})(this.shapes, this.offset);
	},
	move: function(t,gravity,sceneSpeed) {
		//Speed is a function of time -- more natural than position
		var deduction;
		if( this.jumpStartTime /*If currently jumping*/ )
			deduction = t-(this.jumpStartTime*gravity);	//Compounded negative acceleration
			
		var xSpeed = this.speed.x.call(this, t),
			ySpeed = this.speed.y.call(this, t);
		ySpeed = deduction?ySpeed-deduction:(
			t==this.jumpStartTime?ySpeed:0
		);
		if( this.fixed ) {
			//Fixed in terms of gravity and scene movement
			this.offset.x += this.speed.x.call(this, t);
			this.offset.y += this.speed.y.call(this, t);
		} else {
			this.offset.x += xSpeed;
			this.offset.y += ySpeed;
						
			this.offset.x -= sceneSpeed.x(t);
			this.offset.y -= sceneSpeed.y(t);
		}		
	},
	jumpStartTime: null,
	endJump: function() {
		this.jumpStartTime = null;
	},
	startJump: function(t,velocity) {
		//set jump start time
		this.jumpStartTime = t;
		return (this.jumpForce = velocity);		
	},
	currentVelocity: function() {
		return this.jumpStartTime?this.jumpForce:0;	//If falling, upward force is same as when jump begins
	},
	isOccupied: function(x,y) {
		for( var k in this.shapes ) {
			var shape = this.shapes[k],
				pastx = x,
				pasty = y;							
		
		//Check if x is in range [offset.x + shape.x, offset.x + shape.x + size]
		//Check if y is in range [offset.y + shape.y, offset.y + shape.y + size]
		
		var error = 0;				
		
		if(
				(pastx >= (this.offset.x+shape.x)-error && pastx <= (this.offset.x+shape.x)+shape.width+error) &&
				(pasty <= (this.offset.y+shape.y)-error && pasty >= (this.offset.y+shape.y)-shape.height+error)
			) return true;
		}
		return false;
	},
	overlaps: function(character) {
		for( var k in this.shapes ) {
			if( !character || !character.shapes ) continue;
			var shape  = character.shapes[k],
				offset = character.offset;											
						
			//Check corners for overlap
			if(		(this.isOccupied(offset.x+shape.x, offset.y+shape.y)) ||
					(this.isOccupied(offset.x+shape.x+(shape.width||shape.size), offset.y+shape.y)) ||
					(this.isOccupied(offset.x+shape.x, offset.y+(shape.height||shape.size))) ||
					(this.isOccupied(offset.x+shape.x+(shape.width||shape.size), offset.y+shape.y+(shape.height||shape.size)))
			) return true;
		}
		return false;
	},
	kill: function() {
		delete(characters[this.title]);
	},
	revive: function() {
		characters[this.title] = this;
	}
};var CharacterList = function(arr) { 
	this.extend(arr);
};	

//Character extends Array, extended with move and draw
CharacterList.prototype.extend(Array.prototype, {
	move: function(t) {
		var characters = this;
		for( var k in characters ) {		
			character = characters[k];					
			character && character.move && character.move(t,characters.gravity,characters.sceneSpeed);					
			
			var collisions = character.collisions;
			for( var k in collisions ) {
				if( k == "extend" ) continue;
				var collision = collisions[k];				

				if( characters[k].overlaps && (character.overlaps(characters[k]) || characters[k].overlaps(character)) )
					collision();
			}
		}
	},
	draw: function(t) {
		var characters = this;
		for( var k in characters ) {
			character = characters[k];					
			character && character.shade && character.shade(t);
		}
	},
	gravity: 1
});