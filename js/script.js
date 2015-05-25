(function() {
	var	canvas = document.getElementById('myCanvas'),
			
	// Obtain a graphics context on the
	// canvas element for drawing.
	context = canvas.getContext('2d');
 
	// Start listening to resize events and
	// draw canvas.
	initialize();
 	function initialize() {
		// Register an event listener to
		// call the resizeCanvas() function each time 
		// the window is resized.
		window.addEventListener('resize', resizeCanvas, false);
		
		// Draw canvas border for the first time.
		resizeCanvas();
	}
		
	// Drawing the circle.
	function redraw() {
        var centerX = canvas.width / 2;
        var centerY = canvas.height / 2;
        var radius = 125;

        var img = new Image();
        img.onload = function() {
            context.save();
            context.beginPath()
            context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
            context.clip();
            context.drawImage(this, centerX-150, centerY-175, 470/1.5, 537/1.5);
            context.lineWidth = 5;
            context.strokeStyle = '#ffff00';
            context.stroke();
            context.restore();
        }
        img.src="./images/profile.jpg";
        // context.fillStyle = 'green';
        // context.fill();

        context.lineWidth = 5;
        context.strokeStyle = '#003300'
        context.stroke();
    }

	// Runs each time the DOM window resize event fires.
	// Resets the canvas dimensions to match window,
	// then draws the new borders accordingly.
	function resizeCanvas() {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		redraw();
	}

})();
