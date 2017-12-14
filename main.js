console.log("JS Active");

// Current position of the airplane
var position = {lat:Math.toRadians(33.310680), lon:Math.toRadians(-84.772372), alt:1000, rotation: 0.2};

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
var traffic_screen_objects = [];


var codefont;
var airports;

var json_imports = [];

var url_pre = 'http://nornick3.zapto.org/';
//var url_pre = 'http://192.168.10.1/display/';

var loadedJSON = false;
function preload() {
  clearShapeScreenObjects();
  calculateRangeConsts();
   codefont = loadFont(url_pre + "fonts/monaco.ttf");
   imported_files = 3;
   $.getJSON(url_pre + 'json/Airports.json', function(data) {
        json_imports.push({id: ShapeType.AIRPORT, layer: 7, data:data})
        console.log("Process Airports");
        activate();
   });
   $.getJSON(url_pre + 'json/Class_Airspace-B.json', function(data) {
        json_imports.push({id: ShapeType.CLASS_B, layer: 6, data: data.features})
        console.log("Process Class B");
        //generateShapeScreenObjects(data.features, ShapeType.CLASS_B, 6);
        activate();
   });
   $.getJSON(url_pre + 'json/Class_Airspace-C.json', function(data) {
        json_imports.push({id: ShapeType.CLASS_C, layer: 5, data: data.features})
        console.log("Process Class C");
        //generateShapeScreenObjects(data.features, ShapeType.CLASS_C, 5);
        activate();
   });
   $.getJSON(url_pre + 'json/Class_Airspace-D.json', function(data) {
        json_imports.push({id: ShapeType.CLASS_D, layer: 4, data: data.features})
        console.log("Process Class D");
        //generateShapeScreenObjects(data.features, ShapeType.CLASS_D, 4);
        activate();
   });
   $.getJSON(url_pre + 'json/Class_Airspace-E.json', function(data) {
        json_imports.push({id: ShapeType.CLASS_E, layer: 3, data: data.features})
        console.log("Process Class E");
        //generateShapeScreenObjects(data.features, ShapeType.CLASS_E, 3);
        activate();
   });
   $.getJSON(url_pre + 'json/United_States.json', function(data) {
        json_imports.push({id: ShapeType.STATE, layer: 0, data: data.features})
        console.log("Process State Borders");
        //generateShapeScreenObjects(data.features, ShapeType.STATE, 1);
        activate();
   });
   $.getJSON(url_pre + 'json/Lakes.json', function(data) {
        json_imports.push({id: ShapeType.LAKE, layer: 2, data: data.features})
        console.log("Process Lakes");
        //generateShapeScreenObjects(data.features, ShapeType.LAKE, 2);
        activate();
   });
   /*$.getJSON(url_pre + 'json/Rivers.json', function(data) {
        rivers = data.features;
        console.log("Process Rivers");
        //generateShapeScreenObjects(rivers, ShapeType.RIVER);
        activate();
   });*/
   $.getJSON(url_pre + 'json/Urban.json', function(data) {
        json_imports.push({id: ShapeType.URBAN, layer: 1, data: data.features})
        urban = data.features;
        console.log("Process Urban Areas");
        //generateShapeScreenObjects(urban, ShapeType.URBAN, 0);
        activate();
   });
}


var conn;

function setup(){

  trafficInit();
  situationInit();

  createCanvas(map_params.width, map_params.height);
  background('#0f82e6');
  //console.log(position);
  noLoop();
  frameRate(12);

  // Calculate constants that only need to be calculated once ever
  initialScreenObjectConstants();



}




var theta = 0;

var val = 1;
function draw(){
  //map_scale = sin(theta) * 0.01 + 3;
  //theta += 0.15;
  clear();
  background('#0f82e6');

  position.screen_x = map_params.widthdiv2 = map_params.width>>1;
  position.screen_y = map_params.heightdiv2 = map_params.height>>1;

  //position.rotation += 0.005;

  //console.log(lat);
  //position.lat += 0.00575958653 * val;
  //position.lon += 0.00005;
  val *= -1

  if(loadedJSON === true){
    // Check that the current range is still valid
    if(!rangeStillValid()){
      // Recalculate range if not
      calculateRangeConsts();
      // Recalculate the block
      calculateCurrentBlock();
    }
    // Calculate constants for this frame
    screenObjectConstants();
    // Configure the canvas for drawing items on the map
    configureCanvas();
    // Draw items on the map
    drawScreenObjects(shape_screen_objects);
    drawTrafficObjects(traffic_screen_objects);
    // Restore the canvas for top-layer interface items
    restoreCanvas();
    // Draw static interface items
    //drawCompass(bands[bands.length-1]+3);
    drawBands();
    // Draw top-layer interface items
    drawUser();

    console.log("T:" + trafficCount + " :: S:" + situationCount);
    trafficCount = 0;
    situationCount = 0;
  }else{
    // Draw an invalid "X"
    drawInvalid();
  }
}
