//Keyboard functions
var kkeys 	= {},
	isDown 	= function(char) {
		return kkeys[char];
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
};	