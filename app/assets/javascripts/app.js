//= require config
//= require mohican
//= require translations
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
