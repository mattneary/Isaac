//Simple extension
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
};		