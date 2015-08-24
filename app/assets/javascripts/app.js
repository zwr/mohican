//= require_tree ./lib
//= require ./app/main
//= require_tree ./app
//= require_self

angular.element(document).ready(function documentReady() {
  'use strict';
  angular.bootstrap(document.querySelector('[data-main-app]'), [
    'id5'
  ], {
    strictDi: true
  });
});

/*
function blah() {
  var i;
  for(i = 0; i<4; i++) {
    var b;
    b = b || 7;
    alert(b);
    b = b + 1;
  }
}

function blah2() {
  var i;
  for(i = 0; i<4; i++) {
    function blah2_helper() {
      var b;
      b = b || 7;
      alert(b);
      b = b + 1;
    }
    blah2_helper();
  }
}

blah();blah2();
*/
