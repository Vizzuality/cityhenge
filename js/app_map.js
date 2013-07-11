$(function() {

var months = [];

function onDrag(e) {
  var w = $(e.target).position().left
  $(".highlight").width(w + 20);
}

$( "#slider .handle" ).draggable({
  containment: "parent",
  axis: "x",
  drag: onDrag
});

var vis = cartodb.createVis('mapContainer', 'http://viz2.cartodb.com/api/v1/viz/new_york_osm_line_clean/viz.json');
vis.done(function(vis, layers) { });

});
