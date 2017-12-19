var screen_obj_const = {};
function screenObjectConstants(){

  var airport_radius = 1;
  screen_obj_const.airport_dia = 2 * map_scale * airport_radius;
  screen_obj_const.airport_text_offset = {};
  screen_obj_const.airport_text_offset.d = airport_radius /** map_scale*/ * sqrt2ov2 + 7

  screen_obj_const.scale_undo = 1/scale_test;
  screen_obj_const.scall_redo = scale_test;

  screen_obj_const.airport_text_offset.x = screen_obj_const.airport_text_offset.d * cos(position.rotation + PI/4);
  screen_obj_const.airport_text_offset.y = screen_obj_const.airport_text_offset.d * sin(position.rotation + PI/4);
  screen_obj_const.class_e_size = map_scale / 3;
  screen_obj_const.airport_border_size = screen_obj_const.class_e_size;
  screen_obj_const.class_b_size = map_scale / 7;
  textSize(10);
  textStyle(NORMAL);
  textFont(codefont);
}

var band_font_width = 12;
function initialScreenObjectConstants(){
  screen_obj_const.band = {};
  screen_obj_const.band.x_offset = Math.round(band_font_width * sqrt2ov2 * 0.6);
  screen_obj_const.band.y_offset = Math.round(band_font_width * sqrt2ov2 * 0.33333333 * 0.5);
}

var urban_alpha = 1;

var test;
var object_count = 0;
var strokeType;
function drawScreenObjects(objects){
  object_count += objects.length;
  for(var layer = 0; layer < objects.length; layer++){
    for(var i = 0; i < objects[layer].length; i++){
      var obj = objects[layer][i];
      /*if(info == null){
        noFill();
        stroke('#FF0000');
      }*/

      strokeType = Stroke.POLY;

      if(obj.type === ShapeType.AIRPORT){
        trans(obj.pos.x * map_scale, obj.pos.y * map_scale);
        strokeWeight(screen_obj_const.airport_border_size);
        /*if(obj.data.twr){
          stroke(24,73,133);
        }else{
          stroke(137,35,86)
        }*/
        stroke('#FFFFFF');
        fill('#00c729');
        //fill(25,25,26);
        ellipse(0, 0, screen_obj_const.airport_dia);
        fill('#FFFFFF');
        stroke(bg_color);

        trans_add(screen_obj_const.airport_text_offset.x, -screen_obj_const.airport_text_offset.y);
        scale(1/scale_test, 1/scale_test);
        rot(-position.rotation);
        text(obj.data.icao, 0, 0);
        noStroke();
        text(obj.data.icao, 0, 0);
        rot_rev();
        scale(scale_test, scale_test);
        trans_rev();

      //}else if(obj.type === ShapeType.RIVER){
        //console.log("River");
      }else{

        // Poly shape
        switch(obj.type){
          case ShapeType.CLASS_B:
            noFill();
            stroke(51,121,182);
            strokeWeight(screen_obj_const.class_b_size);
            break;
          case ShapeType.CLASS_C:
            noFill();
            stroke('#FFA500');
            strokeWeight(screen_obj_const.class_b_size);
            break;
          case ShapeType.CLASS_D:
            noFill();
            stroke('#00FF00');
            strokeWeight(1);
            break;
          case ShapeType.CLASS_E:
            noFill();
            stroke('#864f8c');
            strokeWeight(screen_obj_const.class_e_size);
            break;
          case ShapeType.STATE:
            fill(bg_color);
            stroke('#FFFF00');
            strokeWeight(1);
            break;
          case ShapeType.RIVER:
            noFill();
            stroke('#0f82e6');
            strokeWeight(1);
            strokeType = Stroke.LINE;
            break;
          case ShapeType.LAKE:
            fill('#0f82e6');
            noStroke();
            break;
          case ShapeType.URBAN:
            fill('#FFFF00');
            noStroke();
            break;
          default:
            noFill();
            stroke('#bdbde7');
            strokeWeight(1);
        }
        switch(strokeType){
          case Stroke.POLY:
            beginShape();
            for(var j = 0; j < obj.data.coords.length; j++){
              vertex(obj.data.coords[j].x * map_scale, obj.data.coords[j].y * map_scale);
            }
            endShape(CLOSE);
            break;
          case Stroke.LINE:
            var last_x = obj.data.coords[0].x * map_scale;
            var last_y = obj.data.coords[0].y * map_scale;
            for(var j = 1; j < obj.data.coords.length; j++){
              line(last_x, last_y, obj.data.coords[j].x * map_scale, obj.data.coords[j].y * map_scale)
              last_x = obj.data.coords[j].x * map_scale;
              last_y = obj.data.coords[j].y * map_scale;
            }
            break;
        }
      }
    }
  }
}

function drawTrafficObjects(objects){
  for(var key in objects){
    if(!objects.hasOwnProperty(key)){
      continue;
    }
    var obj = objects[key];
    if(obj.pos.lat == 0 || obj.pos.lon == 0){
      continue;
    }
    trans(obj.pos.x * map_scale, obj.pos.y * map_scale);
    noStroke();
    fill('#FF0000');

    rot(Math.toRadians(obj.data.Track));

    beginShape();
    vertex(-5, 5);
    vertex(5, 5);
    vertex(0, -10);
    endShape(CLOSE);

    rot_rev();

    //ellipse(0,0,20);
    //console.log(obj.data.Reg + " : " + Math.toDegrees(obj.pos.lat) + " , " + Math.toDegrees(obj.pos.lon));
    fill('#FFFFFF');
    trans_add(screen_obj_const.airport_text_offset.x, -screen_obj_const.airport_text_offset.y);
    rot(-position.rotation);
    text(key, 0, 0);
    rot_rev();


    trans_rev();
  }
}

var transform_params = {x: 0, y: 0, theta: 0};
function configureCanvas(){
  var out = relativePosition(referencePos, position); // Bearing + Dist
  transform_params.theta = position.rotation;
  transform_params.x = referencePos.x + out.dist * Math.cos(out.bearing+PI) * map_scale + map_params.widthdiv2;
  transform_params.y = referencePos.y + out.dist * Math.sin(out.bearing+PI) * map_scale + map_params.heightdiv2;
  translate(transform_params.x, transform_params.y);
  scale(scale_test, scale_test);
  rotate(transform_params.theta);
}

function restoreCanvas(){
  rotate(-transform_params.theta);
  scale(1/scale_test, 1/scale_test);
  translate(-transform_params.x, -transform_params.y);
}

function withinLimits(lat, lon, limits){
  if(limits === undefined){
    limits = range_limits;
  }
  lat = Math.toRadians(lat);
  lon = Math.toRadians(lon);
  var val = limits.lower_lat <= lat && limits.upper_lat >= lat && limits.lower_lon <= lon && limits.upper_lon >= lon;
  return val;
}

function stateOverlap(border, limits){
  if(limits === undefined){
    limits = range_limits;
  }
  //debugger;
  /*var upper = {lat: container.upper_lat, lon: container.upper_lon};
  var lower = {lat: container.lower_lat, lon: container.lower_lon};
  var case1 = pointInside(limits, upper, name);
  var case2 = pointInside(limits, lower, name);*/

  var tmp_border = {};

  tmp_border.upper_lat = Math.toRadians(border.upper_lat);
  tmp_border.upper_lon = Math.toRadians(border.upper_lon);
  tmp_border.lower_lat = Math.toRadians(border.lower_lat);
  tmp_border.lower_lon = Math.toRadians(border.lower_lon);
  return intersectRect(limits, tmp_border);
}

function intersectRect(r2, r1) {
  return !(r2.lower_lon > r1.upper_lon ||
           r2.upper_lon < r1.lower_lon ||
           r2.upper_lat > r1.lower_lat ||
           r2.lower_lat < r1.upper_lat)
      ||   (r1.upper_lat > r2.upper_lat && r1.lower_lat < r2.lower_lat
           && r1.upper_lon > r2.upper_lon && r1.lower_lon < r2.lower_lon)
      ||   (r2.upper_lat > r1.upper_lat && r2.lower_lat < r1.lower_lat
           && r2.upper_lon > r1.upper_lon && r2.lower_lon < r1.lower_lon)
           ;
}

// x : lat
// y : lon
function overlapping2D(a,b){
  if (a.upper_lat < b.lower_lat) return false; // a is left of b
  if (a.lower_lat > b.upper_lat) return false; // a is right of b
  if (a.upper_lon < b.lower_lon) return false; // a is above b
  if (a.lower_lon > b.upper_lon) return false; // a is below b
  return true; // boxes overlap
}

var lat_lon_thresh_scale = 0.1;
function rangeStillValid(){
  // Save copy of the current range
  //debugger;
  var tmp_range = range_limits;
  // Calculate range for edges of the screen
  calculateRangeConsts(0);

  // Calculate current lat and lon range values. Used to determine if the
  // current block size is too big.
  var lat_lon_thresh_scale = 0.1 / map_scale;
  var lat_thresh = (tmp_range.upper_lat - tmp_range.lower_lat) - (range_limits.upper_lat - range_limits.lower_lat);
  var lon_thresh = (tmp_range.upper_lon - tmp_range.lower_lon) - (range_limits.upper_lon - range_limits.lower_lon);
  //console.log(lat_thresh);
  // Check if the range is still valid
  if(

    !(range_limits.upper_lat >= tmp_range.upper_lat || range_limits.lower_lat <= tmp_range.lower_lat|| range_limits.upper_lon >= tmp_range.upper_lon || range_limits.lower_lon <= tmp_range.lower_lon)

    &&

    Math.max(lat_thresh, lon_thresh) < lat_lon_thresh_scale

  ){
    // Restore the range to the previous value;
    range_limits = tmp_range;
    return true;
  }
  return false;
}

var range_limits
var default_offset = 50;
function calculateRangeConsts(offset){
  if(offset === undefined){
    offset = default_offset;
  }
  map_params.width = $("#" + map_holder_div).width();
  map_params.height = $(window).height() - $("#" + menu_div).height() - $("#header_bar").height();
  map_params.heightdiv2 = map_params.height>>1;
  map_params.widthdiv2 = map_params.width>>1;

  // Calculate screen click bounds
  calculate_null_boundries();

  range_limits = {};
  /*var tmp = pixelToLatLon(-offset, -offset);
  range_limits.upper_lat = tmp.lat;
  range_limits.lower_lon = tmp.lon;
  tmp = pixelToLatLon(map_params.width + offset, map_params.height + offset);
  range_limits.lower_lat = tmp.lat;
  range_limits.upper_lon = tmp.lon;*/

  var corners = [
    pixelToLatLon(-offset, -offset),                                      // Top Left
    pixelToLatLon(map_params.width + offset, -offset),                    // Top Right
    pixelToLatLon(map_params.width + offset, map_params.height + offset), // Bottom Right
    pixelToLatLon(-offset, map_params.height + offset)                    // Bottom Left
  ];

  /*noFill();
  stroke('#FFFFFF');
  beginShape();
  vertex(-offset, -offset);
  vertex(map_params.width + offset, -offset);
  vertex(map_params.width + offset, map_params.height + offset);
  vertex(-offset, map_params.height + offset);
  endShape(CLOSE);*/

  range_limits.upper_lat = Math.max(corners[0].lat, corners[1].lat, corners[2].lat, corners[3].lat);
  range_limits.upper_lon = Math.max(corners[0].lon, corners[1].lon, corners[2].lon, corners[3].lon);

  range_limits.lower_lat = Math.min(corners[0].lat, corners[1].lat, corners[2].lat, corners[3].lat);
  range_limits.lower_lon = Math.min(corners[0].lon, corners[1].lon, corners[2].lon, corners[3].lon);

}


function circleRelief(band_width, radius){
  return band_width / radius;
}

var bands = [5, 15, 25];
function drawBands(){

  var x = map_params.widthdiv2;
  var y = map_params.heightdiv2;

  var x_offset = screen_obj_const.band.x_offset
  var y_offset = screen_obj_const.band.y_offset
  strokeWeight(1);
  for(var i = 0; i < bands.length; i++){
    var characters = bands[i].toString().length;
    var small = bands[i] * map_scale * 2;
    var small_text = small * sqrt2ov4;
    var rel = circleRelief(band_font_width * (characters + 1), small)/2;

    // Add band
    noFill();
    stroke('#777777');
    arc(x, y, small, small, -PI/4 + rel, -PI/4 - rel);

    // Add text
    fill('#777777');
    noStroke();
    textSize(band_font_width);
    trans(x - x_offset * characters + small_text, y - y_offset - small_text);
    rot(PI/4);
    text(bands[i], 0, 0);
    rot_rev();
    trans_rev();
  }
}

//{name: "KATL", lat: 33.633549, lon: -84.431150, runways: [{angle: 9, length: 10}], radius: 1.5}


function drawUser(){
  //noStroke();
  strokeWeight(2);
  stroke(255,255,255);
  fill('#1E90FF');
  trans(position.screen_x, position.screen_y);
  beginShape();
  vertex(-5, 5);
  vertex(5, 5);
  vertex(0, -10);
  endShape(CLOSE);
  trans_rev();
}

// {name:"N2549Z",lat:33.426594, lon:-84.950748, alt:3500, hdg: 155}
function drawAirplane(target){
  var pos = relativePosition(position, {lat: target.lat, lon: target.lon});
  pos.offsetY = position.screen_y + pos.dist * Math.sin(pos.bearing) * map_scale;
  pos.offsetX = position.screen_x + pos.dist * Math.cos(pos.bearing) * map_scale;
  noStroke();
  fill('#B22222');
  trans(pos.offsetX ,pos.offsetY);
  rot(Math.toRadians(target.hdg) + position.rotation);
  beginShape();
  vertex(-5, 5);
  vertex(5, 5);
  vertex(0, -10);
  endShape(CLOSE);
  rot_rev();

  fill('#FFFFFF');
  textSize(10);
  textStyle(NORMAL);
  textFont(codefont);
  trans_add(10, -10);
  text(target.name, 0, 0);
  trans_rev();

}

function drawInvalid(){
  noFill();
  stroke('#B22222');
  strokeWeight(5);
  line(0,0,map_params.width,map_params.height);
  line(0,map_params.height,map_params.width,0);
  strokeWeight(1);
}

function drawFrameRate(){
  var rate = getFrameRate();
  trans(map_params.width - 5, map_params.height - 5);
  noStroke();
  fill('#777777');
  textAlign(RIGHT);
  textSize(9)
  text(rate.toFixed(1), 0, 0);
  textAlign(LEFT);
  trans_rev();
}

function drawCompass(){

  trans(map_params.width - 30 ,30);

  colorMode(RGB, 255, 255, 255, 1);
  fill(0,0,0,0.7)
  noStroke();
  ellipse(0, 0, 30);
  colorMode(RGB, 255);

  rot(position.rotation);
  fill("#444444");
  strokeWeight(1);
  beginShape();
  vertex(0,12);
  vertex(-5,1);
  vertex(5,1);
  endShape(CLOSE);
  rot_add(PI);
  fill("#FF0000");
  beginShape();
  vertex(0,12);
  vertex(-5,1);
  vertex(5,1);
  endShape(CLOSE);
  rot_rev();
  trans_rev();

  /*noStroke();
  fill('#B22222');
  var x = position.screen_x;
  var y = position.screen_y;

  trans(x + cos(position.rotation - PI/2) * radial * map_scale, y + sin(position.rotation - PI/2) * radial * map_scale);
  rot(position.rotation);
  beginShape();
  vertex(-5, 5);
  vertex(5, 5);
  vertex(0, -10);
  endShape(CLOSE);
  rot_rev();
  trans_rev();

  noFill();
  stroke('#B22222');

  var len = Math.max(map_params.width, map_params.height);
  var x_len = cos(-position.rotation - PI/2 + 0.005) * len;
  var y_len = sin(-position.rotation - PI/2 + 0.005) * len;
  line(x + x_len, y - y_len, x - x_len, y + y_len);*/
}
