$(function() {

var months = [];

$( "#slider .handle" ).draggable({
  containment: "parent",
  axis: "x",
  drag: function(e) {
    console.log($(e.target).position().left);
    var w = $(e.target).position().left
    $(".highlight").width(w + 20);
  },
});

var vis = cartodb.createVis('mapContainer', 'http://viz2.cartodb.com/api/v1/viz/new_york_osm_line_clean/viz.json');
vis.done(function(vis, layers) { });

});
