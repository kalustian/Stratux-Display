var band_font_width = 12;

function circleRelief(band_width, radius){
  return band_width / radius;
}

var bands = [5, 15, 25];
function drawBands(){

  let x = Math.round(map_params.width/2);
  let y = Math.round(map_params.height/2);

  let x_offset = Math.round(band_font_width * sqrt2ov2 * 0.6);
  let y_offset = Math.round(band_font_width * sqrt2ov2 * 0.33333333 * 0.5);

  for(let i = 0; i < bands.length; i++){
    noFill();
    stroke('#777777');

    let characters = bands[i].toString().length;

    let small = Math.round(bands[i] * map_scale * 2);
    let small_text = Math.round(small / 2 * sqrt2ov2);
    let rel = circleRelief(band_font_width * (characters + 1), small) / 2;
    arc(x, y, small, small, -PI/4 + rel, -PI/4 - rel);

    // Add text
    fill('#777777');
    noStroke();
    textSize(band_font_width);
    textStyle(NORMAL);
    textFont(codefont);
    trans(x - x_offset * characters + small_text, y - y_offset - small_text);
    rot(PI/4);
    text(bands[i], 0, 0);
    rot_rev();
    trans_rev();
  }
}

//{name: "KATL", lat: 33.633549, lon: -84.431150, runways: [{angle: 9, length: 10}], radius: 1.5}

function drawAirport(airport){
  let pos = relativePosition(position, {lat: airport.lat, lon: airport.lon});
  //{runways: [32], radius: 5}
  let radius = 1;
  pos.offsetY = position.screen_y + pos.dist * Math.sind(pos.bearing) * map_scale;
  pos.offsetX = position.screen_x + pos.dist * Math.cosd(pos.bearing) * map_scale;

  fill(25,25,26);
  stroke('#FFA500');

  /*for(let i = 0; i < airport.runways.length; i++){
    let ang = Math.toRadians((airport.runways[i].angle + 9) * 10) + position.rotation;
    let x_offset = airport.runways[i].length / 2 * Math.cos(ang) * map_scale;
    let y_offset = airport.runways[i].length / 2 * Math.sin(ang) * map_scale;

    line(pos.offsetX + x_offset, pos.offsetY + y_offset, pos.offsetX - x_offset, pos.offsetY - y_offset);
  }*/

  noStroke();
  ellipse(pos.offsetX, pos.offsetY, 2 * map_scale * radius);

  fill('#FFFFFF');
  noStroke();
  textSize(10);
  textStyle(NORMAL);
  textFont(codefont);
  trans(pos.offsetX + radius * map_scale * sqrt2ov2 + 2, pos.offsetY - radius * map_scale * sqrt2ov2 - 2);
  text(airport.icao, 0, 0);
  trans_rev();

}

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
  pos.offsetY = position.screen_y + pos.dist * Math.sind(pos.bearing) * map_scale;
  pos.offsetX = position.screen_x + pos.dist * Math.cosd(pos.bearing) * map_scale;
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
