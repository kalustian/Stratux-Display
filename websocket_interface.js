var trafficWS;
function trafficInit(){
  trafficWS = new WebSocket('ws://192.168.33.36:8090');

  trafficWS.onopen = function(e) {
    console.log("Connection established!");
    console.log(e);
  };

  trafficWS.onclose = function(e) {
    var name = e.target.url.substr(e.target.url.lastIndexOf('/') + 1);
    if(e.wasClean){
      console.log("Websocket \"" + name + "\" closed cleanly.");
    }else{
      console.warn("Websocket \"" + name + "\" did not closed cleanly.");
    }
  };

  trafficWS.onmessage = processMessage;

  trafficWS.onerror = function(message) {
    var name = message.target.url.substr(message.target.url.lastIndexOf('/') + 1);
    console.error("Websocket \"" + name + "\" had an error.");
  };
}



var traffic_screen_objects = {};
var trafficCount = 0;
function processMessage(e){
  trafficCount ++;
  var data = JSON.parse(e.data);
  var name = "";

  if(data.Reg == undefined || data.Reg == null || data.Reg == ""){
    name = data.Tail;
  }else{
    name = data.Reg;
  }
  traffic_screen_objects[data.Reg] = new ScreenObject(
    ShapeType.TRAFFIC,
    new Position(data.Lat, data.Lng),
    data
  );
  //console.log("update");
}

var situationWS;
function situationInit(){
  situationWS = new WebSocket('ws://192.168.10.1/situation');

  situationWS.onopen = function(e) {
    console.log("Connection established!");
    console.log(e);
  };

  situationWS.onclose = function(e) {
    console.log("Connection closed!");
  };

  situationWS.onmessage = processSituationMessage;

  situationWS.onerror = function(e) {
    console.log(e.data);
  };
}

var situationCount = 0;
function processSituationMessage(e){
  situationCount ++;
  var data = JSON.parse(e.data);
  position = {
    lat: Math.toRadians(data.Lat),
    lon: Math.toRadians(data.Lng),
    alt: data.Alt,
    rotation: Math.toRadians(data.TrueCourse)
  };
}
