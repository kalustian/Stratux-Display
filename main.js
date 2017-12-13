console.log("JS Active");

// Current position of the airplane
var position = {lat:33.310680, lon:-84.772372, alt:1000, rotation: 0};

// Current position of the atl airport
var katl = {lat:33.633549, lon:-84.431150, alt:1000};

// Current map scale, defined in miles per pixel
var map_scale = 10;

// Width in NM
var airport_width = 5;

var map_params = {};
/*var airports = [
  {name: "KATL", lat: 33.633549, lon: -84.431150, runways: [{angle: 9, length: 10}], radius: 1.5},
  {name: "KCCO", lat: 33.310680, lon: -84.772372, runways: [{angle: 32, length: 5}], radius: 1},
  {name: "KPDK", lat: 33.8738, lon: -84.30, runways: [{angle: 3, length: 6}, {angle: 34, length:4 }], radius: 1.25}
];*/

var codefont;
var airports;
var loadedJSON = false;
function preload() {
   codefont = loadFont("http://nornick3.zapto.org/fonts/monaco.ttf");
   $.getJSON('http://nornick3.zapto.org/info.json', function(data) {
       airports = data;
       loop();
       loadedJSON = true;
   });
}

function setup(){
  map_params.width = $(window).width();
  map_params.height = $(window).height();
  createCanvas(map_params.width, map_params.height);
  background('#323432');
  //console.log(position);
  noLoop();
  frameRate(30);

}




var theta = 0;


function draw(){
  map_scale = sin(theta) * 2 + 12;
  theta += 0.015;
  clear();
  background('#323432');

  position.screen_x = map_params.width/2;
  position.screen_y = map_params.height/2;

  position.rotation += 0.001;



  drawCompass(bands[bands.length-1]+3);
  drawBands();

  let count = 0;
  //console.log(airports);
  if(loadedJSON == true){
    for(let i = 0; i < airports.length; i++){
      if(fastDistance(position, airports[i]) - 10< max(map_params.width, map_params.height) / map_scale / 2){
        drawAirport(airports[i]);
        count ++;
      }
    }
  }else{
    drawInvalid();
  }

  drawAirplane({name:"N2549Z",lat:33.426594, lon:-84.950748, alt:3500, hdg: 155});

  //drawAirport(katl, {runways: [{angle: 9, length: 10}], radius: 1.5});
  //drawAirport(kcco, {runways: [{angle: 32, length: 5}], radius: 1});


  drawUser();


  //drawFPS();





  /*if (mouseIsPressed) {
    fill(25,25,26);
  } else {
    fill(69,69,69);
  }
  ellipse(mouseX, mouseY, 80, 80);*/
}
