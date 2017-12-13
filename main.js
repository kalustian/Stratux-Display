console.log("JS Active");

// Current position of the airplane
var position = {lat:Math.toRadians(33.310680), lon:Math.toRadians(-84.772372), alt:1000, rotation: 0};

// Current position of the atl airport
//var katl = {lat:33.633549, lon:-84.431150, alt:1000};

// Current map scale, defined in miles per pixel
var map_scale = 3;

var map_params = {};
/*var airports = [
  {name: "KATL", lat: 33.633549, lon: -84.431150, runways: [{angle: 9, length: 10}], radius: 1.5},
  {name: "KCCO", lat: 33.310680, lon: -84.772372, runways: [{angle: 32, length: 5}], radius: 1},
  {name: "KPDK", lat: 33.8738, lon: -84.30, runways: [{angle: 3, length: 6}, {angle: 34, length:4 }], radius: 1.25}
];*/

var shape_screen_objects = [];
var airport_screen_objects = [];
var traffic_screen_objects = [];


var codefont;
var airports;

var class_b;
var class_c;
var class_d;
var class_e;
var states;


var loadedJSON = false;
function preload() {
  clearShapeScreenObjects();
   codefont = loadFont("http://nornick3.zapto.org/fonts/monaco.ttf");
   $.getJSON('http://nornick3.zapto.org/json/info.json', function(data) {
        airports = data;
        generateAirportScreenObjects();
        activate();
   });

   $.getJSON('http://nornick3.zapto.org/json/Class_Airspace-B.json', function(data) {
        class_b = data.features;
        console.log("Process Class B");
        generateShapeScreenObjects(class_b);
        activate();
   });
   $.getJSON('http://nornick3.zapto.org/json/Class_Airspace-C.json', function(data) {
        class_c = data.features;
        console.log("Process Class C");
        generateShapeScreenObjects(class_c);
        activate();
   });
   $.getJSON('http://nornick3.zapto.org/json/Class_Airspace-D.json', function(data) {
        class_d = data.features;
        console.log("Process Class D");
        generateShapeScreenObjects(class_d);
        activate();
   });
   $.getJSON('http://nornick3.zapto.org/json/Class_Airspace-E.json', function(data) {
        class_e = data.features;
        console.log("Process Class E");
        generateShapeScreenObjects(class_e);
        activate();
   });
   $.getJSON('http://nornick3.zapto.org/json/United_States.json', function(data) {
        states = data.features;
        console.log("Process States");
        generateShapeScreenObjects(states);
        activate();
   });
}




function setup(){
  map_params.width = $(window).width();
  map_params.height = $(window).height();
  createCanvas(map_params.width, map_params.height);
  background('#323432');
  //console.log(position);
  noLoop();
  frameRate(12);



  traffic_screen_objects.push(new ScreenObject(
    ObjectTypes.TRAFFIC,
    new Position(33.426594,-84.950748),
    {name:"N2549Z",lat:33.426594, lon:-84.950748, alt:3500, hdg: 155}
  ));


  calculateRangeConsts();

  // Calculate constants that only need to be calculated once ever
  initialScreenObjectConstants();


}




var theta = 0;

var val = 1;
function draw(){
  //map_scale = sin(theta) * 2 + 12;
  //theta += 0.15;
  clear();
  background('#323432');

  position.screen_x = map_params.widthdiv2 = map_params.width>>1;
  position.screen_y = map_params.heightdiv2 = map_params.height>>1;

  //position.rotation += 0.005;

  //console.log(lat);
  //position.lat += 0.00575958653 * val;
  //position.lon += 0.00005;
  val *= -1

  if(loadedJSON === true){
    // Calculate current range limits
    calculateRangeConsts();
    // Draw static interface items
    //drawCompass(bands[bands.length-1]+3);
    drawBands();
    // Calculate constants for this frame
    screenObjectConstants();
    // Configure the canvas for drawing items on the map
    configureCanvas();
    // Draw items on the map
    drawScreenObjects(shape_screen_objects);
    //drawScreenObjects(airport_screen_objects);
    //drawScreenObjects(traffic_screen_objects);
    // Restore the canvas for top-layer interface items
    restoreCanvas();
    // Draw top-layer interface items
    drawUser();
  }else{
    // Draw an invalid "X"
    drawInvalid();
  }
}
