//var ObjectTypes = {AIRPORT:0, TRAFFIC: 1, POLY: 2};


var referencePos = new Position(33.310680, -84.772372, 0, 0);
function Position(lat, lon, x, y){
  this.lat = Math.toRadians(lat);
  this.lon = Math.toRadians(lon);
  if(x === undefined || y === undefined){
    updatePosition(this)
  }else{
    this.x = x;
    this.y = y;
    this.out = {dist: 0, bearing: 0};
  }
}

function updatePosition(pos){
  var out = relativePosition(referencePos, pos); // Bearing + Dist
  pos.out = out;
  pos.x = referencePos.x + out.dist * Math.cos(out.bearing);
  pos.y = referencePos.y + out.dist * Math.sin(out.bearing);
}

function ScreenObject(type, pos, data, color_override){
  this.type = type;
  this.pos = pos;
  this.data = data;
  this.color_override = color_override;
}

function clearShapeScreenObjects(){
  shape_screen_objects = [];
}

var counter = 0;
function generateShapeScreenObjects(shapes, id, layer){
  addLayer(layer);
  var flag = null;
  if(id === ShapeType.AIRPORT){
    // Current list is an airport
    for(var i = 0; i < shapes.length; i++){
      if(withinLimits(shapes[i].lat, shapes[i].lon) === true){
        var obj = new ScreenObject(
          id,
          new Position(shapes[i].lat, shapes[i].lon),
          shapes[i]
        );
        shape_screen_objects[layer].push(obj);
        object_count ++;
      }
    }
  }else{
    // Current list is not an airport. Geomerty involved.
    for(var i = 0; i < shapes.length; i++){
      var shape = shapes[i];
      switch(shape.type){
        case "p":
          var out_of_bounds = true;
          var data = {};
          data.coords = [];
          var state_override = false;
          if(id === ShapeType.STATE && stateOverlap(shape.bdr))
            state_override = true;
          for(var j = 0; j < shape.dat.length; j++){
            var coord = shape.dat[j];
            var lat = 0;
            var lon = 0;
            if(id === ShapeType.CLASS_B || id === ShapeType.CLASS_C || id === ShapeType.CLASS_D){
              lat = coord[0];
              lon = coord[1];
            }else{
              lat = coord[1];
              lon = coord[0];
            }
            if(out_of_bounds === true && (state_override === true || withinLimits(lat, lon))) {
              out_of_bounds = false;
            }
            data.coords.push(new Position(lat, lon));
          }
          var color_override = null;
          if(!out_of_bounds){
            shape_screen_objects[layer].push(new ScreenObject(
              id,
              data.coords[0],
              data,
              color_override
            ));
            object_count ++;
          }
          break;
        case "l":
          var out_of_bounds = true;
          var data = {};
          data.coords = [];
          var state_override = false;
          if(id === ShapeType.STATE && stateOverlap(shape.bdr))
            state_override = true;
          for(var j = 0; j < shape.dat.length; j++){
            var coord = shape.dat[j];
            var lat = 0;
            var lon = 0;
            lat = coord[1];
            lon = coord[0];
            if(out_of_bounds === true && (state_override === true || withinLimits(lat, lon))) {
              out_of_bounds = false;
            }
            data.coords.push(new Position(lat, lon));
          }
          var color_override = null;
          if(!out_of_bounds){
            shape_screen_objects[layer].push(new ScreenObject(
              id,
              data.coords[0],
              data,
              color_override
            ));
            object_count ++;
          }
          break;
        default:
          flag = "Unknown shape type: " + shape.type;
          break;
      }
    }
  }
  if(flag != null){
    console.warn(flag);
  }
  return;
}
