var null_boundries = [];
function calculate_null_boundries(){
  null_boundries = [];

  var screen_width = $(window).width();
  var screen_height = $(window).height();

  // Header Bar
  null_boundries.push({x1: 0, x2: $("#header_bar").outerWidth(), y1: 0, y2: $("#header_bar").outerHeight()});

  // Menu Bar
  null_boundries.push({x1: 0, x2: $("#menu").outerWidth(), y1: screen_height - $("#menu").outerHeight(), y2: screen_height});

  // Icon Area
  null_boundries.push({x1: $("#map_icons").position().left, x2: $("#map_icons").position().left + $("#map_icons").outerWidth(), y1: $("#map_icons").position().top, y2: $("#map_icons").position().top + $("#map_icons").outerHeight()});

  // Info Bar
  if($("#info_bar").css("display") !== "none"){
    null_boundries.push({x1: $("#info_bar").position().left, x2: $("#info_bar").position().left + $("#info_bar").outerWidth(), y1: $("#info_bar").position().top, y2: $("#info_bar").position().top +   $("#info_bar").outerHeight()});
  }

  for(var i = 0; i < null_boundries.length; i++){
    null_boundries[i].y1 -= $("#map_holder").position().top;
    null_boundries[i].y2 -= $("#map_holder").position().top;
  }
}

function mouseClicked(){

  // Ignore if the console is open
  if($("#console").css("display") !== "none")
    return;

  if(pointValid(mouseX, mouseY, null_boundries)){
    // Close the info bar if clicked on the map
    if($("#info_bar").css("display") !== "none"){
      setInfoMenu(false);
      return;
    }
    var result = pixelToLatLon(mouseX, mouseY);
    var pos = {};
    pos.x = referencePos.x + result.dist * Math.cos(result.angle);
    pos.y = referencePos.y + result.dist * Math.sin(result.angle);

    var ref = {};

    for(var i = 0; i < shape_screen_objects[airport_layer].length; i++){
      ref.x = shape_screen_objects[airport_layer][i].pos.y;
      ref.y = shape_screen_objects[airport_layer][i].pos.x;
      var dist = Math.sqrt((pos.x-ref.x) * (pos.x-ref.x) + (pos.y-ref.y) * (pos.y-ref.y));
      if(dist < 20/map_scale){
        setAirportInfo(shape_screen_objects[airport_layer][i].data);
        selectMenuPage(MenuPage.INFO);
        return;
      }
    }
  }
}

function clearInfoArea(){
  $("#info_scroll_zone").html('');
  $("#info_header").html('');
}

InfoTypes = {TEXT: 0, KVAL: 1, TITLE:2, NAME:3};
function addInfoElement(type, key, value){
  switch(type){
    case InfoTypes.TEXT:
      $("#info_scroll_zone").append("<div class=\"text_zone green\">" + key + "</div>");
      break;
    case InfoTypes.NAME:
      $("#info_header").append(key + "<span>" + value + "</span>");
      break;
    case InfoTypes.KVAL:
      $("#info_scroll_zone").append("<div class=\"field_box\"><span>" + key + "</span><span>" + value + "</span></div>");
      break;
    case InfoTypes.TITLE:
      $("#info_scroll_zone").append("<div class=\"title_zone\">" + key + "</div>");
      break;
  }
}

var weather_toggle = false;
var orientation_toggle = false;
function initInterfaceObjects(){
  $( "#plus-icon" ).click(function() {
    if(map_scale < 23){
      map_scale *= 1.5;
    }
  });
  $( "#minus-icon" ).click(function() {
    if(map_scale > 4){
      map_scale /= 1.5;
    }
  });
  $( '#info_buttons [name="A"]' ).click(function(){
    $( '#info_buttons [name="A"]' ).toggleClass( "selected" );
  });
  $( '#info_buttons [name="B"]' ).click(function(){
    $( '#info_buttons [name="B"]' ).toggleClass( "selected" );
  });
  $( '#info_buttons [name="C"]' ).click(function(){
    $( '#info_buttons [name="C"]' ).toggleClass( "selected" );
  });
  $( "#cloud-icon" ).click(function() {
    weather_toggle = !weather_toggle;
    $( '#cloud-icon [name="frame"]' ).toggleClass( "icon-bg-highlight" );
  });
  $( "#plane-icon" ).click(function() {
    orientation_toggle = !orientation_toggle;
    $( '#plane-icon [name="frame"]' ).toggleClass( "icon-bg-highlight" );
  });

}

function setInfoMenu(val){
  if(val){
    $( '#info_bar' ).css("display", "block");
    $( '#status_bar' ).removeClass('status_top_right');
    $( '#status_bar' ).addClass('status_bottom_left');
  }else{
    $( '#info_bar' ).css("display", "none");
    $( '#status_bar' ).removeClass('status_bottom_left');
    $( '#status_bar' ).addClass('status_top_right');
  }
}

var menuInfo = {};
var MenuPage = {INFO:0}
function selectMenuPage(page){
  switch(page){
    case MenuPage.INFO:
      clearInfoArea();
      addInfoElement(InfoTypes.NAME, menuInfo.icao, menuInfo.name);
      addInfoElement(InfoTypes.TITLE, "AIRPORT FREQUENCIES");
      if(menuInfo.awos.length !== 0)
        addInfoElement(InfoTypes.KVAL, "AWOS", menuInfo.awos);
      if(menuInfo.ctaf.length !== 0)
        addInfoElement(InfoTypes.KVAL, "CTAF", menuInfo.ctaf);
      if(menuInfo.unic.length !== 0)
        addInfoElement(InfoTypes.KVAL, "UNICOM", menuInfo.unic);
      addInfoElement(InfoTypes.TITLE, "Runways");
      for(var i = 0; i < menuInfo.rwy.length; i++){
        addInfoElement(InfoTypes.TITLE, menuInfo.rwy[i].name);
        addInfoElement(InfoTypes.KVAL, "Length", menuInfo.rwy[i].len + "'");
        addInfoElement(InfoTypes.KVAL, "Width", menuInfo.rwy[i].wid + "'");
      }
      addInfoElement(InfoTypes.TITLE, "Information");
      addInfoElement(InfoTypes.KVAL, "Towered", (menuInfo.twr?"Yes":"No"));
      addInfoElement(InfoTypes.KVAL, "Elevation", menuInfo.elv + "'");
      addInfoElement(InfoTypes.KVAL, "Fee", (menuInfo.fee?"Yes":"No"));

      $("#info_buttons [name=A]").addClass("selected");
      $("#info_buttons [name=B]").removeClass("selected");
      $("#info_buttons [name=C]").removeClass("selected");

      break;
  }
  setInfoMenu(true);
}

function setAirportInfo(info){
  menuInfo = info;
}

function pointValid(mouseX, mouseY, bounds){
  for(var i = 0; i < bounds.length; i++){
    if((mouseX > bounds[i].x1 && mouseX < bounds[i].x2) && (mouseY > bounds[i].y1 && mouseY < bounds[i].y2))
      return false;
  }
  return true;
}
