var trafficWS;
function trafficInit(){
  trafficWS = new WebSocket('ws://192.168.10.1/traffic');

  trafficWS.onopen = function(e) {
    console.log("Connection established!");
    console.log(e);
  };

  trafficWS.onclose = function(e) {
    console.log("Connection closed!");
  };

  trafficWS.onmessage = processMessage;

  trafficWS.onerror = function(e) {
    console.log(e.data);
  };
}

var traffic_screen_objects = {};
var trafficCount = 0;
function processMessage(e){
  trafficCount ++;
  let data = JSON.parse(e.data);
  let name = "";

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
