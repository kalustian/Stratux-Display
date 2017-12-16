(function(){
    var oldLog = console.log;
    console.log = function (message) {
        oldLog.apply(console, arguments);
        $( "#print_area" ).append( "<p>" + message + "</p>" );
        $("#console").scrollTop($('#console').prop("scrollHeight"));
    };
})();

var console_active = false;
$( document ).ready(function() {
  $( "#terminal_button" ).click(function() {
    if(!console_active){
      noLoop();
      $( "#terminal_button" ).addClass('selected');
      $( "#terminal_button span" ).addClass('selected');
      $( "#normal_screen" ).css('display', 'none');
      $( "#console" ).css('display', 'block');
    }else{
      $( "#terminal_button" ).removeClass('selected');
      $( "#terminal_button span" ).removeClass('selected');
      $( "#normal_screen" ).css('display', 'block');
      $( "#console" ).css('display', 'none');
      loop();
    }
    console_active = !console_active;
  });
  $( "#console" ).css("height",$(window).height() - $( "#header_bar" ).height() - $( "#menu" ).height())
  $( "#console textarea" ).keyup(function(e){
    if((e.keyCode || e.which) == 13) { //Enter keycode
      console.log($( "#console textarea" ).val() + " : " + eval($( "#console textarea" ).val()));
      $( "#console textarea" ).val('');
    }
});
});
