var screen_obj_const = {};
function screenObjectConstants(){
  screen_obj_const.airport_text_offset.x = screen_obj_const.airport_text_offset.d * cos(position.rotation + PI/4);
  screen_obj_const.airport_text_offset.y = screen_obj_const.airport_text_offset.d * sin(position.rotation + PI/4);

  textSize(10);
  textStyle(NORMAL);
  textFont(codefont);
}

var band_font_width = 12;
function initialScreenObjectConstants(){
  screen_obj_const.band = {};
  screen_obj_const.band.x_offset = Math.round(band_font_width * sqrt2ov2 * 0.6);
  screen_obj_const.band.y_offset = Math.round(band_font_width * sqrt2ov2 * 0.33333333 * 0.5);
  let airport_radius = 1;
  screen_obj_const.airport_dia = 2 * map_scale * airport_radius;
  screen_obj_const.airport_text_offset = {};
  screen_obj_const.airport_text_offset.d = airport_radius * map_scale * sqrt2ov2 + 7
}



var test;
var object_count = 0;
function drawScreenObjects(objects){
  object_count += objects.length;
  for(let layer = 0; layer < objects.length; layer++){
    for(let i = 0; i < objects[layer].length; i++){
      let obj = objects[layer][i];
      /*if(info == null){
        noFill();
        stroke('#FF0000');
      }*/

      if(obj.type === ShapeType.AIRPORT){
        trans(obj.pos.x * map_scale, obj.pos.y * map_scale);
        noStroke();
        fill(25,25,26);
        ellipse(0, 0, screen_obj_const.airport_dia);
        fill('#FFFFFF');
        trans_add(screen_obj_const.airport_text_offset.x, -screen_obj_const.airport_text_offset.y);
        rot(-position.rotation);
        text(obj.data.icao, 0, 0);
        rot_rev();
        trans_rev();
      }else if(obj.type === ShapeType.TRAFFIC){

      }else{
        // Poly shape
        switch(obj.type){
          case ShapeType.CLASS_B:
            noFill();
            stroke('#bdbde7');
            break;
          case ShapeType.CLASS_C:
            noFill();
            stroke('#0000FF');
            break;
          case ShapeType.CLASS_D:
            noFill();
            stroke('#00FF00');
            break;
          case ShapeType.CLASS_E:
            noFill();
            stroke('#BC6ACD');
            break;
          case ShapeType.STATE:
            fill('#323432');
            stroke('#FFFF00');
            break;
          case ShapeType.RIVER:
            noFill();
            stroke('#0f82e6');
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
            console.log(obj)
        }
        beginShape();
        for(let j = 0; j < obj.data.coords.length; j++){
          vertex(obj.data.coords[j].x * map_scale, obj.data.coords[j].y * map_scale);
        }
        endShape(CLOSE);
      }
    }
  }
}

var transform_params = {x: 0, y: 0, theta: 0};
function configureCanvas(){
  let out = relativePosition(referencePos, position); // Bearing + Dist
  transform_params.theta = position.rotation;
  transform_params.x = referencePos.x + out.dist * Math.cos(out.bearing+PI) * map_scale + map_params.widthdiv2;
  transform_params.y = referencePos.y + out.dist * Math.sin(out.bearing+PI) * map_scale + map_params.heightdiv2;
  translate(transform_params.x, transform_params.y);
  rotate(transform_params.theta);
}

function restoreCanvas(){
  rotate(-transform_params.theta);
  translate(-transform_params.x, -transform_params.y);
}

function withinLimits(lat, lon, limits = range_limits){
  lat = Math.toRadians(lat);
  lon = Math.toRadians(lon);
  let val = limits.lower_lat <= lat && limits.upper_lat >= lat && limits.lower_lon <= lon && limits.upper_lon >= lon;
  return val;
}

var lat_lon_thresh_scale = 0.1;
function rangeStillValid(){
  // Save copy of the current range
  //debugger;
  let tmp_range = range_limits;
  // Calculate range for edges of the screen
  calculateRangeConsts(0);

  // Calculate current lat and lon range values. Used to determine if the
  // current block size is too big.
  let lat_lon_thresh_scale = 0.1 / map_scale;
  let lat_thresh = (tmp_range.upper_lat - tmp_range.lower_lat) - (range_limits.upper_lat - range_limits.lower_lat);
  let lon_thresh = (tmp_range.upper_lon - tmp_range.lower_lon) - (range_limits.upper_lon - range_limits.lower_lon);
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
function calculateRangeConsts(offset = 50){
  map_params.width = $(window).width();
  map_params.height = $(window).height();
  map_params.heightdiv2 = map_params.height>>1;
  map_params.widthdiv2 = map_params.width>>1;

  range_limits = {};
  /*var tmp = pixelToLatLon(-offset, -offset);
  range_limits.upper_lat = tmp.lat;
  range_limits.lower_lon = tmp.lon;
  tmp = pixelToLatLon(map_params.width + offset, map_params.height + offset);
  range_limits.lower_lat = tmp.lat;
  range_limits.upper_lon = tmp.lon;*/

  let corners = [
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

  let x = map_params.widthdiv2;
  let y = map_params.heightdiv2;

  let x_offset = screen_obj_const.band.x_offset
  let y_offset = screen_obj_const.band.y_offset

  for(let i = 0; i < bands.length; i++){
    let characters = bands[i].toString().length;
    let small = Math.round(bands[i] * map_scale<<1);
    let small_text = Math.round(small / 2 * sqrt2ov2);
    let rel = circleRelief(band_font_width * (characters + 1), small)/2;

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
  noStroke();
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
  let pos = relativePosition(position, {lat: target.lat, lon: target.lon});
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

function drawCompass(radial){
  noStroke();
  fill('#B22222');
  let x = position.screen_x;
  let y = position.screen_y;

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

  let len = Math.max(map_params.width, map_params.height);
  let x_len = cos(-position.rotation - PI/2 + 0.005) * len;
  let y_len = sin(-position.rotation - PI/2 + 0.005) * len;
  line(x + x_len, y - y_len, x - x_len, y + y_len);
}
