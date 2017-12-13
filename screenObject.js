var ObjectTypes = {AIRPORT:0, TRAFFIC: 1, POLY: 2};


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
    if(inRange(obj.pos)){
      airport_screen_objects.push(obj);
    }
  }
}

function clearShapeScreenObjects(){
  shape_screen_objects = [];
}

var counter = 0;

function generateShapeScreenObjects(shapes){
  for(let i = 0; i < shapes.length; i++){
    let shape = shapes[i];
    switch(shape.geometry.type){
      case "Polygon":
        let data = {};
        data.info = shape.properties;
        data.coords = [];
        for(let j = 0; j < shape.geometry.coordinates[0].length; j++){
          let coord = shape.geometry.coordinates[0][j];
          data.coords.push(new Position(coord[1], coord[0]));
        }
        shape_screen_objects.push(new ScreenObject(
          ObjectTypes.POLY,
          data.coords[0],
          data
        ));
        break
      case "MultiPolygon":
        let info = shape.properties;
        for(let j = 0; j < shape.geometry.coordinates.length; j++){
          let main = shape.geometry.coordinates[j];
          for(let z = 0; z < main.length; z++){
            let sub = main[z];
            let data = {};
            data.info = info;
            data.coords = [];
            for(let a = 0; a < sub.length; a++){
              let coord = sub[a];
              data.coords.push(new Position(coord[1], coord[0]));
            }
            shape_screen_objects.push(new ScreenObject(
              ObjectTypes.POLY,
              data.coords[0],
              data
            ));
          }
        }

        /*let info = shape.properties;
        for(let j = 0; j < shape.geometry.coordinates.length; j++){
          let data = {};
          data.info = info;
          data.coords = [];
          for(let z = 0; z < shape.geometry.coordinates[j].length; z++){
            let coord = shape.geometry.coordinates[j][z];
            data.coords.push(new Position(coord[1], coord[0]));
          }
          shape_screen_objects.push(new ScreenObject(
            ObjectTypes.POLY,
            data.coords[0],
            data
          ));
          counter++;
        }*/
        break
      default:
        console.log("def: " + shape.geometry.type);
        break;
    }
  }
  console.log("Done");
}
