/* Math constants */
var sqrt2ov2 = 0.70710678;
var sqrt2ov4 = 0.3535533906;
var sqrt2 = 1.4142135624;
var R = 6371e3; // Earth radius in metres
var m2nmi = 0.000539957;
var Rxm2nmi = R * m2nmi;
var PI = 3.141592653589793238462643383;

/* Enum Types */
var ShapeType = {LAKE:0, RIVER:1, URBAN:2, STATE:3, CLASS_B:4, CLASS_C:5, CLASS_E:6, CLASS_D:7, AIRPORT:8, TRAFFIC:9};
var Stroke = {LINE:0, POLY:1};
var ErrorType = {FILENOTFOUND:0, TIMEOUT:1, ABORT:2, UNKNOWN:3, ZIP:4};

/* Global parameters */
var map_scale = 22.5;
var bg_color = "#313331";
var airport_layer = 7;

/* Global vars */
var map_params = {};
var shape_screen_objects = [];
var traffic_screen_objects = [];
var json_imports = [];
var codefont;
