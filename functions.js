function relativePosition(pos1, pos2){
  let out = {};
  let lat1 = pos1.lat;
  let lat2 = pos2.lat;
  let lon1 = pos1.lon;
  let lon2 = pos2.lon;
  let delta_lat = (pos2.lat-pos1.lat);
  let delta_lon = (pos2.lon-pos1.lon);

  let a = Math.sin(delta_lat/2) * Math.sin(delta_lat/2) +
        Math.cos(lat1) * Math.cos(lat2) *
        Math.sin(delta_lon/2) * Math.sin(delta_lon/2);
  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  out.dist = c * Rxm2nmi;

  let y = Math.sin(lon2-lon1) * Math.cos(lat2);
  let x = Math.cos(lat1)*Math.sin(lat2) -
        Math.sin(lat1)*Math.cos(lat2)*Math.cos(lon2-lon1);
  out.bearing = Math.atan2(y, x) + position.rotation - PI/2;

  return out;
}

function bearingDistanceToLatLon(brng, d, lat, lon){
  let out = {};
  d = d / m2nmi;
  out.lat = Math.asin( Math.sin(lat)*Math.cos(d/R) + Math.cos(lat)*Math.sin(d/R)*Math.cos(brng) );
  out.lon = lon + Math.atan2(Math.sin(brng)*Math.sin(d/R)*Math.cos(lat), Math.cos(d/R)-Math.sin(lat)*Math.sin(out.lat));
  return out;
}


//https://www.codeproject.com/Questions/626899/Converting-Latitude-And-Longitude-to-an-X-Y-Coordi
/*function simpleRelativePosition(pos1, pos2){
  x1 = R * Math.cos(lat) * Math.cos(lon)
  y1 = R * Math.cos(lat) * Math.sin(lon)
}*/

function fastDistance(point1, point0){
  deglen = 80.25;
  let x = point1.lat - point0.lat;
  let y = (point1.lon - point0.lon)*Math.cos(point0.lat);
  return deglen*sqrt(x*x + y*y);
}

var oldX = 0;
var oldY = 0;
function trans(newX, newY){
  oldX = newX;
  oldY = newY;
  translate(newX, newY);
}

function trans_add(newX, newY){
  oldX += newX;
  oldY += newY;
  translate(newX, newY);
}

function trans_rev(){
  translate(-oldX, -oldY);
}

var oldRot = 0;
function rot(newRot){
  oldRot = newRot;
  rotate(newRot);
}

function rot_add(newRot){
  oldRot += newRot;
  rotate(newRot);
}

function rot_rev(){
  rotate(-oldRot);
}

function addLayer(layer){
  while(shape_screen_objects[layer] === undefined){
    shape_screen_objects.push([]);
  }
}

var loaded_states = 0;
var imported_files = 0;
function activate(){
  loaded_states ++;
  if(loaded_states >= imported_files){
    loadedJSON = true;
    calculateCurrentBlock();
    loop();
  }
}

function calculateCurrentBlock(){
  object_count = 0;
  clearShapeScreenObjects();
  referencePos = new Position(Math.toDegrees(position.lat), Math.toDegrees(position.lon), 0, 0);
  calculateRangeConsts();
  for(let i = 0; i < json_imports.length; i++){
    generateShapeScreenObjects(json_imports[i].data, json_imports[i].id, json_imports[i].layer);
  }
  console.log("Block recalculation: Objects: " + object_count);
}

// Converts from degrees to radians.
Math.toRadians = function(degrees) {
  return degrees * Math.PI / 180;
};

// Converts from radians to degrees.
Math.toDegrees = function(radians) {
  return radians * 180 / Math.PI;
};

// Converts from degrees to radians.
Math.sind = function(degrees) {
  return sin(Math.toRadians(degrees));
};

// Converts from radians to degrees.
Math.cosd = function(degrees) {
  return cos(Math.toRadians(degrees));
};
