

var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');


// get ref to loading screen
var loading_screen = document.getElementById('loading');

var loaded = false;
var load_counter = 0;

var background = new Image();
var floaties3 = new Image();
var floaties2 = new Image();
var floaties1 = new Image();
var mask_shadow = new Image();
var mask = new Image();
var human_shadow = new Image();
var human = new Image();

var layer_list = [
  {
    'image': background,
    'src': '../img/background.png',
    'z_index': -2.25,
    'position': { x: 0, y: 0 },
    'blend': null,
    'opacity': 1
  },
  {
    'image': floaties3,
    'src': '../img/floaties3.png',
    'z_index': -2,
    'position': { x: 0, y: 0 },
    'blend': null,
    'opacity': 1
  },
  {
    'image': floaties2,
    'src': '../img/floaties2.png',
    'z_index': -1.25,
    'position': { x: 0, y: 0 },
    'blend': null,
    'opacity': 1
  }, // <-- Missing comma here
  {
    'image': floaties1,
    'src': '../img/floaties1.png',
    'z_index': -0.5,
    'position': { x: 0, y: 0 },
    'blend': null,
    'opacity': 1
  },
  {
    'image': mask_shadow,
    'src': '../img/mask_shadow.png',
    'z_index': -1.5,
    'position': { x: 0, y: 0 },
    'blend': 'multiply',
    'opacity': 1
  },
  {
    'image': mask,
    'src': '../img/mask.png',
    'z_index': 0,
    'position': { x: 0, y: 0 },
    'blend': null,
    'opacity': 1
  },
  {
    'image': human_shadow,
    'src': '../img/human_shadow.png',
    'z_index': -1.5,
    'position': { x: 0, y: 0 },
    'blend': 'multiply',
    'opacity': 1
  },
  {
    'image': human,
    'src': '../img/human.png',
    'z_index': 2,
    'position': { x: 0, y: 0 },
    'blend': null,
    'opacity': 1
  }
];

layer_list.forEach(function (layer, index) {
  layer.image.onload = function () {
    load_counter += 1;
    if (load_counter >= layer_list.length) {
    	hideLoading(); //hide loading screen
      requestAnimationFrame(drawCanvas); //runs through this 60times per second
    }
  };
  layer.image.src = layer.src;
});

function hideLoading(){
	loading_screen.classList.add('hidden');
}


function drawCanvas() {
  //clear whatever is on canvas
  context.clearRect(0, 0, canvas.width, canvas.height);

  var rotate_x = (pointer.y * -0.15) + (motion.y * -1.2);
  var rotate_y = (pointer.x * 0.15) + (motion.x * 1.2);

  var transform_string = "rotateX(" + rotate_x + "deg) rotateY("+rotate_y + "deg)";

  // Calculate the parallax offset based on mouse position
  var parallax_offset_x = pointer.x * 0.02;
  var parallax_offset_y = pointer.y * 0.02;

  //loop through each layer and draw it to the canvas
  layer_list.forEach(function (layer, index) {
    // Calculate the parallax position for each layer based on its z_index
    var parallax_x = -parallax_offset_x * layer.z_index;
    var parallax_y = -parallax_offset_y * layer.z_index;

    layer.position = {
      x: getOffset(layer).x + parallax_x,
      y: getOffset(layer).y + parallax_y,
    };

    if (layer.blend) {
      context.globalCompositeOperation = layer.blend;
    } else {
      context.globalCompositeOperation = 'normal';
    }
    context.globalAlpha = layer.opacity;
    context.drawImage(layer.image, layer.position.x, layer.position.y);
  });

  requestAnimationFrame(drawCanvas);
}


function getOffset(layer){
var touch_multiplier = 0.1;

	var touch_offset_x = pointer.x * layer.z_index * touch_multiplier;
	var touch_offset_y = pointer.y * layer.z_index * touch_multiplier;

var motion_multiplier = 2.5;
	var motion_offset_x = motion.x * layer.z_index;
	var motion_offset_y = motion.y * layer.z_index;

	var offset = {
		x: touch_offset_x + motion_offset_x,
		y: touch_offset_y + motion_offset_y
	};
	return offset;
}


////// SO FAR THE IMAGE IS PERFECTLY STILL

// Touch and mouse controls
var moving = false;
var pointer_initial = { x: 0, y: 0 };
var pointer = { x: 0, y: 0 };

canvas.addEventListener('touchstart', pointerStart);
canvas.addEventListener('mousedown', pointerStart);

function pointerStart(event) {
  event.preventDefault();
  moving = true;
  if (event.type == 'touchstart') {
    pointer_initial.x = event.touches[0].clientX;
    pointer_initial.y = event.touches[0].clientY;
    // Set the initial touch position only once when the touch starts
  } else if (event.type == 'mousedown') {
    pointer_initial.x = event.clientX;
    pointer_initial.y = event.clientY;
    // Set the initial mouse position only once when the mouse click starts
  }
}

window.addEventListener('touchmove', pointerMove);
window.addEventListener('mousemove', pointerMove);

function pointerMove(event) {
  event.preventDefault();
  if (moving == true) {
    var current_x = 0;
    var current_y = 0;
    if (event.type == 'touchmove') {
      current_x = event.touches[0].clientX;
      current_y = event.touches[0].clientY;
    } else if (event.type == 'mousemove') {
      current_x = event.clientX;
      current_y = event.clientY;
    }
    pointer.x = current_x - pointer_initial.x; // Calculate the offset relative to initial position
    pointer.y = current_y - pointer_initial.y; // Calculate the offset relative to initial position
  }
}

// ... (your existing code)


canvas.addEventListener('touchmove', function(event){
	event.preventDefault();
});

canvas.addEventListener('mousemove', function(event){
	event.preventDefault();
});

window.addEventListener('touchend', function(event){
	endGesture();
});

window.addEventListener('mouseup', function(event){
	endGesture();
});

function endGesture(){
	moving = false;
	pointer.x = 0;
	pointer.y = 0;
}


//motion controls for tilting

var motion_initial = {
	x:null,
	y:null
}


var motion = {
	x:0,
	y:0
}

// listen to gyroscope
window.addEventListener('deviceorientation', function(event){
	//if this is the first time through
	if(!motion_initial.x && !motion_initial.y){
		motion_initial.x = event.beta;
		motion_initial.y = event.gamma;
	}
	if(window.orientation == 0){
	// device is in portrait orientation
		motion.x = event.gamma - motion_initial.y;
		motion.y = event.beta - motion_initial.x;

	}
	if(window.orientation == 90){
	// device is in landscape left
		motion.x = event.beta - motion_initial.x;
		motion.y = event.gamma - motion_initial.y;
	}
	if(window.orientation == -90){
	// device is in landscape right
		motion.x = -event.beta + motion_initial.x;
		motion.y = event.gamma - motion_initial.y;

	}
	else{
	// device is upside down
		motion.x = -event.gamma + motion_initial.y;
		motion.y = -event.beta + motion_initial.x;
	}
});

//

window.addEventListener('orientationchange', function(event){
	motion_initial.x = 0;
	motion_initial.y = 0;
});







var TxtRotate = function(el, toRotate, period) {
  this.toRotate = toRotate;
  this.el = el;
  this.loopNum = 0;
  this.period = parseInt(period, 10) || 2000;
  this.txt = '';
  this.tick();
  this.isDeleting = false;
};

TxtRotate.prototype.tick = function() {
  var i = this.loopNum % this.toRotate.length;
  var fullTxt = this.toRotate[i];

  if (this.isDeleting) {
    this.txt = fullTxt.substring(0, this.txt.length - 1);
  } else {
    this.txt = fullTxt.substring(0, this.txt.length + 1);
  }

  this.el.innerHTML = '<span class="wrap">'+this.txt+'</span>';

  var that = this;
  var delta = 300 - Math.random() * 100;

  if (this.isDeleting) { delta /= 2; }

  if (!this.isDeleting && this.txt === fullTxt) {
    delta = this.period;
    this.isDeleting = true;
  } else if (this.isDeleting && this.txt === '') {
    this.isDeleting = false;
    this.loopNum++;
    delta = 500;
  }

  setTimeout(function() {
    that.tick();
  }, delta);
};

window.onload = function() {
  var elements = document.getElementsByClassName('txt-rotate');
  for (var i=0; i<elements.length; i++) {
    var toRotate = elements[i].getAttribute('data-rotate');
    var period = elements[i].getAttribute('data-period');
    if (toRotate) {
      new TxtRotate(elements[i], JSON.parse(toRotate), period);
    }
  }
  // INJECT CSS
  var css = document.createElement("style");
  css.type = "text/css";
  css.innerHTML = ".txt-rotate > .wrap { border-right: 0.08em solid #666 }";
  document.body.appendChild(css);
};
