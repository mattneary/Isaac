var Character = function(parameters, spawn /*Pushes new character by default*/) {							
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
		
		var error = 3;
		if(
				(pastx >= (this.offset.x+shape.x-error) && pastx <= (this.offset.x+shape.x)+shape.width+error) &&
				(pasty >= (this.offset.y+shape.y-error) && pasty <= (this.offset.y+shape.y)+shape.height+error)
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
};