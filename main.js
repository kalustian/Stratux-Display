/* Adjust Console Handles */
var version = "0.1.0";

console.log("JS Active");

// Current position of the airplane
var position = {lat:Math.toRadians(33.310680), lon:Math.toRadians(-84.772372), alt:1000, rotation: 0};

//var url_pre = 'http://nornick3.zapto.org/';
var url_pre = '';

var scale_test = 1;

$( document ).ready(function() {
  // Initialize interface objects
  initInterfaceObjects();
  // Remove all objects from the screen object list
  clearShapeScreenObjects();
  // Calculate the current range based on the initial zoom level
  calculateRangeConsts();
  // Initialize traffic connection
  trafficInit();

  // Display console intro message
  console.logIntro();
  // Initialize download loading bars
  console.log("Downloading and processing elements...")
  console.loading_bar("download_apt_xhr", "Download APT", 0);
  console.loading_bar("download_faa_xhr", "Download FAA", 0);
  console.loading_bar("download_env_xhr", "Download ENV", 0);
  console.loading_bar("unzip_apt", "Unzip APT", 0);
  console.loading_bar("unzip_faa", "Unzip FAA", 0);
  console.loading_bar("unzip_env", "Unzip ENV", 0);
});

// Tmp variable to save whether the jsons have been loaded or not
var loadedJSON;

// Preload map information
function preload() {
  // Load airports
  loadedJSON = false;
  // Reset activation counter
  loaded_states = 0;
  var apt_counter = 0;
  fetchZip(url_pre + 'json/compiled_apt.json.zip', function(result){
    console.loading_bar("unzip_apt", "Unzip APT", 1);
    var res = [];
    for(var key in result.airports){
      res.push(result.airports[key]);
    }
    json_imports.push({id: ShapeType.AIRPORT, layer: airport_layer, data:res});
    activate();
  }, function(event){
    // XHR
    var val = event.loaded / event.total;
    console.loading_bar("download_apt_xhr", "Download APT", val);
  }, function(event, tag, name){
    // Zip
    apt_counter++;
    if(apt_counter === 200){
      apt_counter = 0;
      var val = event.loaded / event.total;
      console.loading_bar("unzip_apt", "Unzip APT", val);
    }
  }, function(type, obj){
    switch(type){
      case ErrorType.FILENOTFOUND:
        console.loading_bar("download_apt_xhr", "Download APT", -1, "404");
        break;
      case ErrorType.TIMEOUT:
        console.loading_bar("download_apt_xhr", "Download APT", -1, "Timeout");
        break;
      case ErrorType.ABORT:
        console.loading_bar("download_apt_xhr", "Download APT", -1, "Download Aborted");
        break;
      case ErrorType.UNKNOWN:
        console.loading_bar("download_apt_xhr", "Download APT", -1, "Unknown");
        break;
      case ErrorType.ZIP:
        console.loading_bar("unzip_apt", "Unzip APT", -1, "Unzip Error");
        break;
    }
    commentOnError();
  });

  // Load environmental data
  var env_counter = 0;
  fetchZip(url_pre + 'json/compiled_env.json.zip', function(result){
    console.loading_bar("download_env_xhr", "Download ENV", 1);
    for(var key in result){
      switch(key){
        case "lakes":
          json_imports.push({id: ShapeType.LAKE, layer: 2, data:result[key]});
          break;
        case "rivers":
          json_imports.push({id: ShapeType.RIVER, layer: 2, data:result[key]});
          break;
        case "urban":
          json_imports.push({id: ShapeType.URBAN, layer: 1, data:result[key]});
          break;
        case "states":
          json_imports.push({id: ShapeType.STATE, layer: 0, data:result[key]});
          break;
      }
      activate();
    }
  }, function(event){
    // XHR
    var val = event.loaded / event.total;
    console.loading_bar("download_env_xhr", "Download ENV", val);
  }, function(event, tag, name){
    // Zip
    env_counter++;
    if(env_counter === 200){
      env_counter = 0;
      var val = event.loaded / event.total;
      console.loading_bar("unzip_env", "Unzip ENV", val);
    }
  }, function(type, obj){
    switch(type){
      case ErrorType.FILENOTFOUND:
        console.loading_bar("download_env_xhr", "Download ENV", -1, "404");
        break;
      case ErrorType.TIMEOUT:
        console.loading_bar("download_env_xhr", "Download ENV", -1, "Timeout");
        break;
      case ErrorType.ABORT:
        console.loading_bar("download_env_xhr", "Download ENV", -1, "Download Aborted");
        break;
      case ErrorType.UNKNOWN:
        console.loading_bar("download_env_xhr", "Download ENV", -1, "Unknown");
        break;
      case ErrorType.ZIP:
        console.loading_bar("unzip_env", "Unzip ENV", -1, "Unzip Error");
        break;
    }
    commentOnError();
  });

  // Load airspace data
  var faa_counter = 0;
  fetchZip(url_pre + 'json/compiled_faa.json.zip',function(result){
    console.loading_bar("unzip_faa", "Unzip FAA", 1);
    for(var key in result){
      switch(key){
        case "B":
          json_imports.push({id: ShapeType.CLASS_B, layer: 6, data:result[key]});
          //console.loading_bar("unzip_B", "Unzip Class B", 1);
          break;
        case "C":
          json_imports.push({id: ShapeType.CLASS_C, layer: 5, data:result[key]});
          //console.loading_bar("unzip_C", "Unzip Class C", 1);
          break;
        case "D":
          json_imports.push({id: ShapeType.CLASS_D, layer: 4, data:result[key]});
          //console.loading_bar("unzip_D", "Unzip Class D", 1);
          break;
        case "E":
          json_imports.push({id: ShapeType.CLASS_E, layer: 3, data:result[key]});
          //console.loading_bar("unzip_E", "Unzip Class E", 1);
          break;
      }
      activate();
    }
  }, function(event){
    // XHR
    var val = event.loaded / event.total;
    console.loading_bar("download_faa_xhr", "Download FAA", val);
  }, function(event, tag, name){
    // Zip
    faa_counter++;
    if(faa_counter === 200){
      faa_counter = 0;
      var val = event.loaded / event.total;
      console.loading_bar("unzip_faa", "Unzip FAA", val);
    }
  }, function(type, obj){
    switch(type){
      case ErrorType.FILENOTFOUND:
        console.loading_bar("download_faa_xhr", "Download FAA", -1, "404");
        break;
      case ErrorType.TIMEOUT:
        console.loading_bar("download_faa_xhr", "Download FAA", -1, "Timeout");
        break;
      case ErrorType.ABORT:
        console.loading_bar("download_faa_xhr", "Download FAA", -1, "Download Aborted");
        break;
      case ErrorType.UNKNOWN:
        console.loading_bar("download_faa_xhr", "Download FAA", -1, "Unknown");
        break;
      case ErrorType.ZIP:
        console.loading_bar("unzip_faa", "Unzip FAA", -1, "Unzip Error");
        break;
    }
    commentOnError();
  });

  // Set the code font
  codefont = loadFont(url_pre + "fonts/monaco.ttf");
  // Specify the total number of imports
  imported_files = 9;
}


var conn;
var myCanvas;
var map_holder_div = "map_holder";
var menu_div = "menu";
function setup(){
  myCanvas = createCanvas(map_params.width, map_params.height);
  myCanvas.parent(map_holder_div);
  background('#0f82e6');
  //console.log(position);
  noLoop();
  frameRate(12);

  // Calculate constants that only need to be calculated once ever
  initialScreenObjectConstants();

  controlLooping = true;
  setConsole(true);

}

function draw(){
  clear();
  background('#0f82e6');
  position.screen_x = map_params.widthdiv2 = map_params.width>>1;
  position.screen_y = map_params.heightdiv2 = map_params.height>>1;

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
    drawCompass();
    drawBands();
    // Draw top-layer interface items
    drawUser();
    // Draw framerate meter
    drawFrameRate();

    trafficCount = 0;
    situationCount = 0;
  }else{
    // Draw an invalid "X"
    drawInvalid();
  }
}
