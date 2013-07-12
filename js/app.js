var userAgent = navigator.userAgent.toLowerCase(),
	ua = $.browser;

$.browser.chrome = /chrome/.test(navigator.userAgent.toLowerCase());

if ($.browser.chrome){
  var userAgent = userAgent.substring(userAgent.indexOf('chrome/') +7);
  ua.version = userAgent.substring(0,userAgent.indexOf('.'));
  ua.safari = false;
}

if (((ua.msie && ua.version<10)
      || (ua.mozilla && parseFloat(ua.version.slice(0,3)) < 12)
      || (ua.safari && parseFloat(ua.version.slice(0,3)) < 534)
      || (ua.opera && parseFloat(ua.version.slice(0,3)) < 11)
      || (ua.chrome && ua.version<19))) {
  window.location.href = 'old.html';
}
