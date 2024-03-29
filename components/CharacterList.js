var CharacterList = function(arr) { 
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