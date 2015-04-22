//= require mohican
//= require_tree ./config
//= require_tree ./lib
//= require ./app/main
//= require_self

angular.element(document).ready(function documentReady() {
  'use strict';
  angular.bootstrap(document.querySelector('[data-main-app]'), [
    'id5',
  ], {
    strictDi: true,
  });
});
