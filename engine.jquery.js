//Keyboard functions
var kkeys 	= {},
	isDown 	= function(char) {
		return kkeys[char];
	};
	
var handleKeyPresses = function() {
	$(document).keydown(function(e) {				
		kkeys[String.fromCharCode(e.keyCode)] = true;	
		//Prevent beep
		return false;
	});
	$(document).keyup(function(e) {
		kkeys[String.fromCharCode(e.keyCode)] = false;
	});	
};	//Simple extension
Object.prototype.extend = function(/* variable number of arguments */) {
	var args = Array.prototype.slice.call(arguments);
	for( var k in args ) {
		var push = typeof(arguments[k]) != "function" ? arguments[k] : {};
		console.log(push);
		for(var k in push)
			this[k] = push[k];
	}
};				

//Main function	
var go = function(characters) {				
	var t = 0;
	handleKeyPresses();
	int = setInterval(function() {
		ctx.clearRect(0,0,1000,1000);					
		characters.move(t), characters.draw(t);
		t++;				
	}, 30);
};		var Rect = function(options) {				
	var color = options.color || "#000", 
		x = options.x, 
		y = options.y, 
		width = options.width, 
		height = options.height, 
		size = options.size;
	this.x = x;
	this.y = y;
	this.color = color;
	
	//Either maintain height, width or just size
	this.width = width || size;
	this.height = height || size;
};	var Character = function(parameters, spawn /*Pushes new character by default*/) {							
	shapes = parameters.shapes || [], 
	title = parameters.title || "", 
	speeds = parameters.speeds || {x: Function('return 0'), y: Function('return 0')}, 
	collisions = parameters.collisions || {};
				
	this.title = title;
	this.shapes = shapes;				
	this.speed = {
		x: speeds.x,
		y: speeds.y
	};
	this.offset = {
		x: 0,
		y: 0
	};								
	this.collisions = collisions;	
		
	this.text = parameters.text;			
		
	if( spawn !== false ) characters[title] = this;				
};

Character.prototype = {
	shade: function() {		
		//Bulk drawing
		var text = this.text ? this.text() : '';
		(function(rects, offset, overrideColor) {
			for( var k in rects ) {
				var rect = rects[k];					
				//Defaults
				rect.width 	= rect.width  || rect.size,
				rect.height = rect.height || rect.size;
				offset = offset || {
					x: 0, y: 0
				};				
		
				ctx.fillStyle = overrideColor || rect.color;											
				ctx.fillRect(rect.x+offset.x, height-(rect.y+offset.y), rect.width, rect.height);		
				
				ctx.font         = 'italic 30px sans-serif';
				ctx.textBaseline = 'top';
				if( text )
					console.log("Filling"), ctx.fillText(text, rect.x+offset.x, height-(rect.y+offset.y));
			}
		})(this.shapes, this.offset);
	},
	move: function(t) {
		//Speed is a function of time -- more natural than position
		this.offset.x += this.speed.x.call(this, t);
		this.offset.y += this.speed.y.call(this, t);
	},
	isOccupied: function(x,y) {
		for( var k in this.shapes ) {
			var shape = this.shapes[k],
				pastx = x + (shape.width  || shape.size),
				pasty = y + (shape.height || shape.size);							
		
		//Check if x is in range [offset.x + shape.x, offset.x + shape.x + size]
		//Check if y is in range [offset.y + shape.y, offset.y + shape.y + size]
		
		if(
				(pastx >= (this.offset.x+shape.x-5) && pastx <= (this.offset.x+shape.x)+shape.width+5) &&
				(pasty >= (this.offset.y+shape.y-5) && pasty <= (this.offset.y+shape.y)+shape.height+5)
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
	for( var k in arr )
		this[k] = arr[k];
};	

//Character extends Array, extended with move and draw
CharacterList.prototype.extend(Array.prototype, {
	move: function(t) {
		var characters = this;
		for( var k in characters ) {
			character = characters[k];					
			character && character.move && character.move(t);					
			
			var collisions = character.collisions;
			for( var k in collisions ) {
				var collision = collisions[k];
				
				if( characters[k] && characters[k].overlaps )
				character && character.overlaps && character.overlaps(characters[k]) || characters[k].overlaps && characters[k].overlaps(character) && collision();
			}
		}
	},
	draw: function(t) {
		var characters = this;
		for( var k in characters ) {
			character = characters[k];					
			character && character.shade && character.shade(t);
		}
	}
});