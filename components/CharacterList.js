var CharacterList = function(arr) { 
	for( var k in arr )
		this[k] = arr[k];
};	

//Character extends Array, extended with move and draw
CharacterList.prototype.extend(Array.prototype, {
	move: function(t) {
		var characters = this;
		for( var k in characters ) {
			character = characters[k];					
			character.move && character.move(t);					
			
			var collisions = character.collisions;
			for( var k in collisions ) {
				var collision = collisions[k];
				
				character.overlaps && character.overlaps(characters[k]) || characters[k].overlaps && characters[k].overlaps(character) && collision();
			}
		}
	},
	draw: function(t) {
		var characters = this;
		for( var k in characters ) {
			character = characters[k];					
			character.shade && character.shade(t);
		}
	}
});