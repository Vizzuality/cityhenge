var animating = false;

$(window).resize(function(){
  var op = 0;
  if(!animating){
    var op = (document.body.clientHeight < 730) ? 0 : 1;
    $('h2').animate({
        opacity: op
      },400,
      function(){animating = !animating;
    });
    animating = true;
  }
});