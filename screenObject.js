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
  let out = relativePosition(referencePos, pos); // Bearing + Dist
  pos.out = out;
  pos.x = referencePos.x + out.dist * Math.cos(out.bearing);
  pos.y = referencePos.y + out.dist * Math.sin(out.bearing);
}

function ScreenObject(type, pos, data){
  this.type = type;
  this.pos = pos;
  this.data = data;
}

function generateAirportScreenObjects(){
  airport_screen_objects = [];
  for(let i = 0; i < airports.length; i++){
    let obj = new ScreenObject(ObjectTypes.AIRPORT, new Position(airports[i].lat, airports[i].lon), airports[i]);
    airport_screen_objects.push(obj);
  }
}

function clearShapeScreenObjects(){
  shape_screen_objects = [];
}

var counter = 0;

function generateShapeScreenObjects(shapes, id, layer){
  addLayer(layer);
  let flag = null;
  if(id === ShapeType.AIRPORT){
    for(let i = 0; i < shapes.length; i++){
      if(withinLimits(shapes[i].lat, shapes[i].lon) === true){
        shape_screen_objects[layer].push(new ScreenObject(
          id,
          new Position(shapes[i].lat, shapes[i].lon),
          shapes[i]
        ));
        object_count ++;
      }
    }
  }else{
    for(let i = 0; i < shapes.length; i++){
      let shape = shapes[i];
      switch(shape.geometry.type){
        case "LineString":
        case "Polygon":
          let out_of_bounds = true;
          let data = {};
          data.info = shape.properties;
          data.coords = [];
          for(let j = 0; j < shape.geometry.coordinates[0].length; j++){
            let coord = shape.geometry.coordinates[0][j];
            if(out_of_bounds === true && withinLimits(coord[1], coord[0])){
              out_of_bounds = false;
            }
            data.coords.push(new Position(coord[1], coord[0]));
          }
          if(!out_of_bounds){
            shape_screen_objects[layer].push(new ScreenObject(
              id,
              data.coords[0],
              data
            ));
            object_count ++;
          }
          break;
        case "MultiLineString":
        case "MultiPolygon":
          let info = shape.properties;
          for(let j = 0; j < shape.geometry.coordinates.length; j++){
            let main = shape.geometry.coordinates[j];
            let out_of_bounds = true;
            for(let z = 0; z < main.length; z++){
              let sub = main[z];
              let data = {};
              data.info = info;
              data.coords = [];
              for(let a = 0; a < sub.length; a++){
                let coord = sub[a];
                if(out_of_bounds === true && withinLimits(coord[1], coord[0])){
                  out_of_bounds = false;
                }
                data.coords.push(new Position(coord[1], coord[0]));
              }
              if(!out_of_bounds){
                shape_screen_objects[layer].push(new ScreenObject(
                  id,
                  data.coords[0],
                  data
                ));
                object_count ++;
              }
            }
          }
          break;
        default:
          flag = shape.geometry.type;
          //console.log("def: " + shape.geometry.type);
          break;
      }
    }
  }
  if(flag != null){
    console.log(flag);
  }
}
