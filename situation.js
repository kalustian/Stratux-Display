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
  let data = JSON.parse(e.data);
  position = {
    lat: Math.toRadians(data.Lat),
    lon: Math.toRadians(data.Lng),
    alt: data.Alt,
    rotation: Math.toRadians(data.TrueCourse)
  };
}
