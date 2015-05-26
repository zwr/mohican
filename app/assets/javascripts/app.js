//= require config
//= require mohican
//= require_tree ./lib
//= require ./app/main
//= require_tree ./app
//= require_self

angular.element(document).ready(function documentReady() {
  'use strict';
  angular.bootstrap(document.querySelector('[data-main-app]'), [
    'id5',
  ], {
    strictDi: true,
  });
});
