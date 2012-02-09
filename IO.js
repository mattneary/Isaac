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
};	