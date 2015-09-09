var width = window.innerWidth;
var height = window.innerHeight;

var xfalse = false;
var yfalse = false;

var list_points = [[-100,-100],[-100,height+100],[width+100,-100],[width+100,height+100]]; //Start with 4 corner points

function changeLuminosity(hex, lum)
{
	hex = String(hex).replace(/[^0-9a-f]/gi, '');
	if (hex.length < 6)
	{
		hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
	}
	lum = lum || 0;
	var rgb = "#", c, i;
	for (i = 0; i < 3; i++) {
		c = parseInt(hex.substr(i*2,2), 16);
		c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
		rgb += ("00"+c).substr(c.length);
	}

	return rgb;
}

function getRandom(min, max)
{
	return min + Math.floor(Math.random() * (max - min + 1));
}

function convertRGBtoHex(rgb)
{
	var decColor = 65536 * rgb[0] + 256 * rgb[1] + rgb[2];
	return "#" + decColor.toString(16);
}

function getDistance(point1, point2)
{
	return Math.sqrt(Math.pow(point1[0] - point2[0], 2) + Math.pow(point1[1] - point2[1], 2));
}

function getCoordinate(distance, x1, y1, x2, y2)
{
	if (yfalse == true)
	{
		yfalse = false;
		return Math.abs(Math.sqrt(Math.pow(distance, 2) - Math.pow(x2-x1,2))+y1);
	}
	if (xfalse == true)
	{
		xfalse = false;
		return Math.abs(Math.sqrt(Math.pow(distance, 2) - Math.pow(y2-y1,2))+x1);
	}
}


function generatePoint(startingPoint)
{
	var distance = getRandom(200,300);
	var generate_x = getRandom(0,1);
	var multiplier = [-1,1];
	var multi = multiplier[getRandom(0,1)];
	if (generate_x) {
		var random = getRandom(300,600)/3;
		var x = multi*random + startingPoint[0];
		while (random > distance*0.8)
		{
				random = getRandom(300,600)/3;
				x = random * multi + startingPoint[0];
		}
		yfalse = true;
		var y = getCoordinate(distance,startingPoint[0],startingPoint[1],x,0);
	} else {
		var random = getRandom(300,600)/3;
		var y = multi*random + startingPoint[1];
		while (random > distance *0.8)
		{
				random = getRandom(300,600)/3;
				y = random * multi + startingPoint[1];
		}
		xfalse = true;
		var x = getCoordinate(distance, startingPoint[0],startingPoint[1],0,y);
	}
	return [x,y];
}

function pattern_create(canvas, context) {
	counter = 0
	while (list_points.length > 0 && counter < 140)
	{
		//Select random point in list_points
		var shape = []; //List of points that will be used to create a shape
		var index = getRandom(0, list_points.length-1);
		var starting_point = list_points[index];
		list_points.splice(index, 1);
		shape.push(starting_point);
		possible_points = []; //This will be a set of possible points to create shapes
	
		//Search for nearby points in list between 100 and 300 px. Add to possible_points
		for (var i = 0; i < list_points.length; i++)
		{
			distance = getDistance(list_points[i], starting_point);
			if (distance > 100 && distance < 300)
			{
				possible_points.push(list_points[i]);
			}
		}
	
		//If not enough points, then create those points within the above 200 px. Randomize direction and length of extension
		var num_points = possible_points.length;
		if (num_points >= 3)
		{
			for (var i = 0; i < Math.floor(num_points/2); i++)
			{
				possible_points.push(generatePoint(starting_point));
			}
		} else 
		{
			while (possible_points.length < 3) 
			{
				possible_points.push(generatePoint(starting_point));
			}
		}
		//Create pattern
		for (var i = 0; i < 3; i++)
		{
			var remove_from_list_points = false;
			var index = getRandom(0,possible_points.length-1);
			shape.push(possible_points.splice(index, 1)[0]);
	
			for (var j = 0; j < list_points.length; j++) {
				if (shape[shape.length-1] == list_points[j])
				{
					remove_from_list_points = true;
					break;
				}
				if (i == list_points.length-1) {
					break;		
				}
			}
			if (remove_from_list_points) 
			{
				list_points.splice(i, 1);
			} else {
				list_points.push(shape[shape.length-1]);
			}
		}
	        context.beginPath();
		var currPoint = shape[0];
		var x = currPoint[0];
		var y = currPoint[1];
		var init_hex = convertRGBtoHex(context.getImageData(x,y,1,1).data);
		shape.splice(0, 1);
		context.moveTo(x,y)
	
		for(var i = 0; i < shape.length; i++)
		{
			var currPoint = shape[i];
			var x = currPoint[0];
			var y = currPoint[1];
			context.lineTo(x,y);
		}
	
	        context.closePath();
		brighter = getRandom(0,1);
		if (brighter)
		{
	        	context.fillStyle =  changeLuminosity(init_hex,Math.random()/4 * 1);
		}
		else
		{
			context.fillStyle =  changeLuminosity(init_hex,Math.random()/4 * -1);
		}
	        context.fill();
		counter = counter + 1;
	}
}
	
function canvasUpdate()
{
	var canvas = document.getElementById("myCanvas");
	var context = canvas.getContext("2d");

	canvas.width = width;
	canvas.height = height;

	//create background gradient
	var gradient = context.createLinearGradient(0,0,width,height);
	gradient.addColorStop(0,'#3695E7');
	gradient.addColorStop(1,'#6FF36F');
	context.fillStyle=gradient;
	context.fillRect(0,0,width,height);	
	pattern_create(canvas, context);
}
document.addEventListener("DOMContentLoaded", canvasUpdate, false);
