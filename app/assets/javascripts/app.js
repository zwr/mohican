//= require angular
//= require ./app/main

angular.element(document).ready(function documentReady() {
  'use strict';
  angular.bootstrap(document.querySelector('[data-main-app]'), [
    'id5',
  ], {
    strictDi: true,
  });
});
