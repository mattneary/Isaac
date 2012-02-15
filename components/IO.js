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
};	