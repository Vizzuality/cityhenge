var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var months2 = ["Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov"];
var tt, shader, tod, map, curtod, city;

function adjustMonths(l) {

  var ratio = Math.floor(31 * l/365);
  var monthPadding = 5;

  for (var i = 0; i <= 11; i++) {
    var $li = $(".month_" + (i + monthPadding));
    $li.css({ width: ratio, left: i * ratio });
  }

}

function setupMonths() {

  var ratio = Math.floor(31 * $(document).width()/365);
  var monthPadding = 5;

  for (var i = 0; i <= 11; i++) {
    var $li = $("<li class='month_"+(i + monthPadding)+"'>" + months[(i + monthPadding) % 12] + "</li>");
    $("#slider .months").append($li);
    $li.css({ width: ratio, left: i * ratio });
  }

}

function getDayNumber() {
  var now = new Date();
  var start = new Date(now.getFullYear(), 0, 0);
  var diff = now - start;
  var oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

$(function() {

/*
var d = getDayNumber();
var ratio = 365/$(document).width();
alert(ratio);

$(".highlight").css({ width: d * (1-ratio) });
$(".handle").css({ left: d * (1-ratio) - 10 });
*/
setupMonths();

$("#slider").on("click", function(e) {

  var ratio = $(document).width()/365;

  var w = e.screenX;

  var c = map.getCenter();
  var time = curtod.setTime( tod.getTime() + w/ratio * 1000 * 60 * 60 * 24 );
  tt = SunCalc.getTimes(time, c.lat, c.lon);

  updateDate(w);
  curtod = new Date(tt.sunset);

  VECNIK.Carto.compile(
  "#world { line-width: 2; line-color: #000; [TYPEY='test']{ line-width: 2; } [ZOOM = 0]{ line-width: 2; } }", function(shaderData) {
    if(shaderData) {
      shader.compile(shaderData);
    }
  });

  $(".handle").css({ left: w - 10 });
  $(".highlight").animate({ width: w + "px"}, 150);

});

$(window).resize(function(){
  adjustMonths(document.body.clientWidth);
});

function updateDate(left) {

  function get_nth_suffix(date) {
    switch (date) {
      case 1:
      case 21:
      case 31:
      return 'st';
      case 2:
      case 22:
      return 'nd';
      case 3:
      case 23:
      return 'rd';
      default:
      return 'th';
    }
  }

  if (tt) {
    var month = months2[tt.sunset.getMonth() ];

    var cen = map.getCenter();
    var sunrisePos = SunCalc.getPosition(curtod, cen.lat, cen.lon);
    //console.log(sunrisePos.azimuth);
    var day   = tt.sunset.getDate();
    $(".date").html(month + ", " + day + "<span class='suffix'>" + get_nth_suffix(day) + "</span>");
  }

  $(".date").css({ left: left - $(".date").width() / 2 });

}

function onDrag(e) {

  var ratio = $(document).width()/365;

  var w = $(e.target).position().left
  $(".highlight").width(w + 10);
  var c = map.getCenter();
  var time = curtod.setTime( tod.getTime() + w/ratio * 1000 * 60 * 60 * 24 );
  tt = SunCalc.getTimes(time, c.lat, c.lon);

  //console.log(tt.sunset);
  //console.log($(".date").width() , $(".date").position().left, $("document").width());

  updateDate(w);
  curtod = new Date(tt.sunset);
}

function onStart(e) {

  var w = $(e.target).position().left

  updateDate(w);

  $(".date").fadeIn(250);

}

function onStop(e) {
  var w = $(e.target).position().left

  $(".date").fadeOut(250);
  $(".highlight").width(w + 10);

  VECNIK.Carto.compile(
  "#world { line-width: 2; line-color: #000; [TYPEY='test']{ line-width: 2; } [ZOOM = 0]{ line-width: 2; } }", function(shaderData) {
    if(shaderData) {
      shader.compile(shaderData);
    }
  });

}

$( "#slider .handle" ).draggable({
  containment: "parent",
  axis: "x",
  start: onStart,
  drag: onDrag,
  stop: onStop
});

//var vis = cartodb.createVis('mapContainer', 'http://viz2.cartodb.com/api/v1/viz/new_york_osm_line_clean/viz.json');
//vis.done(function(vis, layers) { });

});



function SketchRender() {
  RND_FACTOR = 1;
  rnd = function() { return RND_FACTOR*( 2*Math.random() -1) ;}

  var times = SunCalc.getTimes(curtod, city.y, city.x );

  function sketchLine(ctx, p0, p1, sunrisePos) {

    var a = sunrisePos.azimuth < 0 ? sunrisePos.azimuth + Math.PI * 2 : sunrisePos.azimuth;

    var dx = p1.x - p0.x;
    var dy = p1.y - p0.y;

    dx *=0.15;
    dy *= 0.15;

    var lw = 0.4;
    var tolerance = 0.03;

    var r = Math.atan2(p1.y - p0.y, p1.x - p0.x) + 0.5*Math.PI;
    r = r < 0 ? r+Math.PI*2 : r;
     //console.log(sunrisePos.azimuth, r)
    var d = Math.abs((r + Math.PI -  a) % (Math.PI*2) - Math.PI)

    // d = d < Math.PI ? d : d - Math.PI;
    if (d < tolerance*Math.PI){
      ctx.strokeStyle = "rgba(254, 217, 118)";
      } else if (d < (tolerance * 1.2)*Math.PI){
      ctx.strokeStyle = "rgba(253, 141, 60)";
      lw = 2
      } else if (d < (tolerance * 1.4)*Math.PI){
      ctx.strokeStyle = "rgba(252, 78, 42, 0.9)";
      lw = 1.8
      } else if (d < (tolerance * 1.6)*Math.PI){
      ctx.strokeStyle = "rgba(189, 0, 38, 0.9)";
      lw = 1.2
      } else if (d < (tolerance * 1.8)*Math.PI){
      ctx.strokeStyle = "rgba(128, 0, 38)";
      lw = .8
      } else {
      ctx.strokeStyle = "rgba(0,0,0, 1)";
      lw = 0.4;
    }
    // }
  for(var i = 0; i < 3; ++i) {
    ctx.beginPath();
    ctx.lineWidth = lw
    ctx.moveTo(p0.x - dx, p0.y - dy);
    ctx.lineTo(p1.x + dx, p1.y + dy);
    ctx.closePath();
    ctx.stroke();
  }
}

var primitive_render = this.primitive_render = {
  'Polygon': function(ctx, coordinates) {
    var c = coordinates;
    var xmin, xmax,ymin, ymax;
    xmin = xmax = c[0].x;
    ymin = ymax = c[0].y;
    var cen = map.getCenter();
    var sunrisePos = SunCalc.getPosition(curtod, cen.lat, cen.lon);
    // console.log(c)
    for(var i=1; i < c.length; ++i) {
      sketchLine(ctx, c[i-1], c[i], sunrisePos);
      var p0 = c[i-1];
      var p = c[i];
      xmin = Math.min(xmin, p.x);
      xmax = Math.max(xmax, p.x);
      ymin = Math.min(ymin, p.y);
      ymax = Math.max(ymax, p.y);

    }
  },
  'MultiPolygon': function(ctx, coordinates) {
    var prender = primitive_render['Polygon'];
    for(var i=0; i < coordinates.length; ++i) {
      prender(ctx, coordinates[i][0]);
    }
  },
  'LineString': function(ctx, coordinates) {
    var p = primitive_render['Polygon'];
    p(ctx, coordinates);
  }
};

}

SketchRender.prototype = new VECNIK.Renderer();

var d = new Date(2013, 6, 1);
var utc = d.getTime() + (d.getTimezoneOffset() * 60000);

function initMap(options) {
  city = options;
  tod = new Date(utc + (3600000 * city.offset));
  var tt = SunCalc.getTimes(tod, city.y, city.x );
  curtod = new Date(tt.sunset);

  VECNIK.Carto.init(function(carto) {
    VECNIK.Carto.compile(
    "#world { line-width: 2; line-color: #000; [TYPEY='test']{ line-width: 2; } [ZOOM = 0]{ line-width: 2; } }"
    , function() {});
  });
  // var stat = new Stats();


  var template = '../img/bk.png'
  var subdomains = [ '', 'a.', 'b.', 'c.' ];
  var provider = new MM.TemplatedLayer(template, subdomains);

  VECNIK.settings.set({
    ENABLE_CLIPPING: true,
    ENABLE_SIMPLIFY: true,
    ENABLE_FIXING: true,
    ENABLE_SNAPPING: true,
  });
  var dataSource = new VECNIK.CartoDB.API({
    user: city.account,
    table: city.table,
    debug: true
  });

  shader = new VECNIK.CartoShader({
    'point-color': '#fff',
    'line-color': '#F00',
    'line-width': function(data) {
      // console.log(data)
      return '0';
    },
    'polygon-fill': function(data) {
      return "rgba(200, 200, 200, 1)";
    }
  });

  var vector_layer = new VECNIK.MM.CanvasProvider(dataSource, shader, new SketchRender());
  fg = new MM.Layer(vector_layer);

  map = new MM.Map(document.getElementById('map'), [provider,  fg])

  if(!location.hash) {
    map.setCenterZoom(new MM.Location(city.y, city.x ), city.z);
  }
  var hash = new MM.Hash(map);
  var t = 0;
  var button = document.getElementById('start_animation');
  function animate(){
    var c = map.getCenter();
    curtod = SunCalc.getTimes(curtod.setTime( tod.getTime() + t * 1000 * 60 * 60 * 24 ), c.lat, c.lon);
    curtod = new Date(curtod.sunset);
    t = t + 2;
    VECNIK.Carto.compile(
    "#world { line-width: 2; line-color: #000; [TYPEY='test']{ line-width: 2; } [ZOOM = 0]{ line-width: 2; } }", function(shaderData) {
      if(shaderData) {
        shader.compile(shaderData);
      }
    });
    document.getElementById('rangeinput').value = t;
    if(t >= 365) {
      button.style.display = 'block';
      } else {
      setTimeout(animate, 0.1);
      // animate();
    }
  }


}
