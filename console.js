$( document ).ready(function() {
  var oldLog = console.log;
  console.log = function (message) {
      // Message means we had a failed download via xhr. Messes console up.
      if(console.log.caller !== null && console.log.caller.toString().replace(/\s/g, '') === "function(e){console.log(e);}")
        return;
      oldLog.apply(console, arguments);
      $( "#print_area" ).append( "<p>" + message + "</p>" );
      $("#console").scrollTop($('#console').prop("scrollHeight"));
  };
  var oldError = console.error;
  console.error = function (message) {
      oldError.apply(console, arguments);
      console.detailedError(message);
  };
  var oldWarn = console.warn;
  console.warn = function (message) {
      oldWarn.apply(console, arguments);
      $( "#print_area" ).append( "<p class=\"warning\">" + message + "</p>" );
      $("#console").scrollTop($('#console').prop("scrollHeight"));
  };
  window.onerror = function(message, url, lineNumber, columnNo, error) {
      console.detailedError(message, url, lineNumber);
  };

  /*loadScript("constants.js", function(){
    loadScript("zip.js", function(){
      loadScript("unzipper.js", function(){
        loadScript("functions.js", function(){
          loadScript("screenObject.js", function(){
            loadScript("drawHelpers.js", function(){
              loadScript("screen_press_mgmt.js", function(){
                loadScript("situation.js", function(){
                  loadScript("traffic.js", function(){
                    loadScript("p5.js", function(){
                      loadScript("main.js", function(){
                        preload();
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });*/

});

/*function loadScript(script, callback){
  var script_id = script.replace(/\W/g,'_');
  var pretty_name = "Download: \"" + script + "\"";
  console.success_bar(script_id, pretty_name);
  $.getScript( script ).done(function( script, textStatus, jqxhr) {
    console.success_bar(script_id, pretty_name, "Success");
    $("head").append("<script>" + script + "</script>");
    callback();
    //console.log(script);
  }).fail(function( jqxhr, settings, exception ) {
    console.success_bar(script_id, pretty_name, "Failure: " + exception, "error_bar");
  });
}*/

/*function loadScript(url, callback){
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'text';
  console.success_bar(url.replace(/\W/g,'_'), url.replace(/\W/g,'_'));
  xhr.onload = function(e) {
    if (this.status == 200) {
      // get binary data as a response
      const reader = new FileReader();
      var text = this.response;//reader.readAsText(this.response);
      $("body").append("<script>" + this.response + "</script>");
      console.success_bar(url.replace(/\W/g,'_'), url.replace(/\W/g,'_'), "Success");
      callback();
    }
  };
  xhr.send();
}*/

console.success_bar = function(success_bar_name, pretty_name, value, attr){
  if(attr === undefined){
    attr = "";
  }
  if($( "#" + success_bar_name ).length === 0){
    $( "#print_area" ).append( "<p id=\"" + success_bar_name + "\">" + pretty_name + ":</p>" );
  }else{
    if(value.length != 0){
      $("#" + success_bar_name).html(pretty_name + ":<span class=\"bar_info no_underline " + attr + "\">" + value + "</span>");
    }else{
      $("#" + success_bar_name).html(pretty_name + ":");
    }
  }
}

console.detailedError = function (message, url, lineNumber){

  // Message means we had a failed download via xhr. Messes console up.
  if(message === "Uncaught SyntaxError: Unexpected token <")
    return;

  if(url !== undefined){
    if(url === '')
      url = 'anonymous';
    if(lineNumber === -1 || lineNumber == '' || lineNumber == "" || lineNumber === undefined){
      $( "#print_area" ).append( "<p class=\"error\">" + message + "<span class=\"command_info\">" + url.substr(url.lastIndexOf('/') + 1) + "</span></p>" );
    }else{
      $( "#print_area" ).append( "<p class=\"error\">" + message + "<span class=\"command_info\">" + url.substr(url.lastIndexOf('/') + 1) + ":" + lineNumber + "</span></p>" );
    }
  }else{
    $( "#print_area" ).append( "<p class=\"error\">" + message + "</p>" );
  }
  $("#console").scrollTop($('#console').prop("scrollHeight"));
  if(!console_active)
    $( '#terminal_button [name="icon"]' ).addClass("error_notice_icon");
}

var console_width = null;
var font_width = 10;
console.loading_bar = function(loading_bar_name, pretty_name, precent, message){
  if(precent === NaN || precent === Infinity){
    precent = -1;
    if(message === undefined || message === null)
      message = "unknown";
  }
  if(console_width === null){
    console_width = $( '#console' ).width() - 210;
  }
  if($( "#" + loading_bar_name ).length === 0){
    $( "#print_area" ).append( "<p id=\"" + loading_bar_name + "\">" + pretty_name + ":<span class=\"loading_info no_underline\">" + 0 + "%</span></p>" );
  }else{
    if(precent === -1){
      $("#" + loading_bar_name).html(
        pretty_name + ":"
        + "<div class=\"loading_bar\" style=\"width:"+width+"px;\"></div>"
        + "<span class=\"loading_info error_bar no_underline\">Failed: " + message + "</span>"
      );
    }else{
      var width = console_width * precent;
      $("#" + loading_bar_name).html(
        pretty_name + ":"
        + "<div class=\"loading_bar\" style=\"width:"+width+"px;\"></div>"
        + "<span class=\"loading_info no_underline\">" + ((precent*100).toFixed(0)) + "%</span>"
      );
    }
  }
}

var console_active = false;
var commandList = [];
var command_number = -1;
var transit = false;
var controlLooping = false;
function setConsole(val){
  console_active = val;
  if(val){
    $( '#terminal_button [name="icon"]' ).removeClass("error_notice_icon");
    $( "#terminal_button" ).addClass('selected');
    $( "#terminal_button span" ).addClass('selected');
    $( "#console" ).css('display', 'block');
    //$(" #input_area ").focus()
    setTimeout(function(){
      if(controlLooping)
        noLoop();
      console_active = true;
      transit = false;
    }, 10);
  }else{
    transit = true;
    if(controlLooping)
      //loop();
    setTimeout(function(){
      $( "#terminal_button" ).removeClass('selected');
      $( "#terminal_button span" ).removeClass('selected');
      $( "#console" ).css('display', 'none');
      console_active = false;
      transit = false;
    }, 10);
  }
}
$( document ).ready(function() {
  $( "#terminal_button" ).click(function() {
    if(!transit && !console_active){
      transit = true;
      setConsole(true);
    }else if(!transit && console_active){
      setConsole(false);
    }

  });
  $( "#console" ).css("height",$(window).height() - $( "#header_bar" ).height() - $( "#menu" ).height())
  $( "#input_area" ).css("bottom", $( "#menu" ).height());
  $( "#input_area" ).css("width", $(window).width() - $( "#console_submit" ).width());
  $( "#print_area" ).css("padding-bottom", $( "#input_area" ).outerHeight());
  $( "#console_submit" ).css("height", $( "#input_area" ).outerHeight()-1);
  $( "#console_submit" ).css("bottom", $( "#menu" ).height());
  $( "#console_submit" ).click(function() {processCommand();});

  $( "#console input" ).keyup(function(e){
    if((e.keyCode || e.which) == 13) { //Enter keycode
      processCommand();
    }else if((e.keyCode || e.which) == 38 || (e.keyCode || e.which) == 40){
      // arrow

      var old_command_number = command_number;

      var abort = false;
      if((e.keyCode || e.which) == 40){
        // Down
        if(command_number === commandList.length - 1 || commandList.length === 0){
          abort = true;
        }else{
          command_number ++;
        }
      }else{
        // Up
        if(command_number === 0 || commandList.length === 0){
          abort = true;
        }else{
          command_number --;
        }
      }

      if(abort)
        return;

      var text = commandList[command_number];
      if(text !== undefined){
        if(!checkContainsTmp()){
          commandList.push({cmd:$( "#console input" ).val(), tmp:true});
        }else if(old_command_number === commandList.length - 1){
          commandList[commandList.length - 1] = {cmd:$( "#console input" ).val(), tmp:true};
        }
        $( "#console input" ).val(text.cmd);
      }
    }
  });
});

function processCommand(){
  var command = $( "#console input" ).val()
  if(command.length === 0 || command === "" || command === '')
    return;
  commandList.push({cmd:command, tmp:false});
  for(var i = commandList.length - 2; i >= 0; i--){
    if(commandList[i].tmp === true){
      commandList.splice(i, 1);
    }
  }
  $( "#console input" ).val('')
  command_number = commandList.length;
  try{
    var result = eval(command);
    $( "#print_area" ).append( "<p><span class=\"command\">" + command + "</span> : " + result + "</p>" );
    $("#console").scrollTop($('#console').prop("scrollHeight"));
  }catch(e){
    console.detailedError(e, "user_input");
  }
}

function checkContainsTmp(){
  for(var i = 0; i < commandList.length; i++){
    if(commandList[i].tmp === true){
      return true;
    }
  }
  return false;
}

console.logIntro = function(){
/*var l1 = "  _____ _             _                _____  _           _             ";
var l2 = "/ ____| |           | |              |  __ \(_)         | |            ";
var l3 = "| (___ | |_ _ __ __ _| |_ _   ___  __ | |  | |_ ___ _ __ | | __ _ _   _ ";
var l4 = "\___ \| __| '__/ _` | __| | | \ \/ / | |  | | / __| '_ \| |/ _` | | | |";
var l5 = "____) | |_| | | (_| | |_| |_| |>  <  | |__| | \__ \ |_) | | (_| | |_| |";
var l6 = "|_____/ \__|_|  \__,_|\__|\__,_/_/\_\ |_____/|_|___/ .__/|_|\__,_|\__, |";
var l7 = "                                                 | |             __/ |";
var l8 = "                                                 |_|            |___/ ";

console.log(l1);
console.log(l2);
console.log(l3);
console.log(l4);
console.log(l5);
console.log(l6);
console.log(l7);
console.log(l8);*/

console.log("Stratux Display version " + version);
console.log("");

}
