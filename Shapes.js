var Rect = function(options) {				
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
};	