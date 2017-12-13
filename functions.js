function relativePosition(pos1, pos2){

  let out = {};

  let lat1 = Math.toRadians(pos1.lat);
  let lat2 = Math.toRadians(pos2.lat);

  let lon1 = Math.toRadians(pos1.lon);
  let lon2 = Math.toRadians(pos2.lon);

  let delta_lat = Math.toRadians((pos2.lat-pos1.lat));
  let delta_lon = Math.toRadians((pos2.lon-pos1.lon));

  let a = Math.sin(delta_lat/2) * Math.sin(delta_lat/2) +
        Math.cos(lat1) * Math.cos(lat2) *
        Math.sin(delta_lon/2) * Math.sin(delta_lon/2);
  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  out.dist = R * c * m2nmi;

  let y = Math.sin(lon2-lon1) * Math.cos(lat2);
  let x = Math.cos(lat1)*Math.sin(lat2) -
        Math.sin(lat1)*Math.cos(lat2)*Math.cos(lon2-lon1);
  out.bearing = Math.toDegrees(Math.atan2(y, x) + position.rotation - PI/2);

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

function rot_rev(){
  rotate(-oldRot);
}

function dashedLine(x1, y1, x2, y2, l, g) {
    var pc = dist(x1, y1, x2, y2) / 300;
    var pcCount = 1;
    var lPercent = gPercent = 0;
    var currentPos = 0;
    var xx1 = yy1 = xx2 = yy2 = 0;

    while (int(pcCount * pc) < l) {
        pcCount++
    }
    lPercent = pcCount;
    pcCount = 1;
    while (int(pcCount * pc) < g) {
        pcCount++
    }
    gPercent = pcCount;

    lPercent = lPercent / 300;
    gPercent = gPercent / 300;
    while (currentPos < 1) {
        xx1 = lerp(x1, x2, currentPos);
        yy1 = lerp(y1, y2, currentPos);
        xx2 = lerp(x1, x2, currentPos + lPercent);
        yy2 = lerp(y1, y2, currentPos + lPercent);
        if (x1 > x2) {
            if (xx2 < x2) {
                xx2 = x2;
            }
        }
        if (x1 < x2) {
            if (xx2 > x2) {
                xx2 = x2;
            }
        }
        if (y1 > y2) {
            if (yy2 < y2) {
                yy2 = y2;
            }
        }
        if (y1 < y2) {
            if (yy2 > y2) {
                yy2 = y2;
            }
        }

        line(xx1, yy1, xx2, yy2);
        currentPos = currentPos + lPercent + gPercent;
    }
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
