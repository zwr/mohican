//= require angular
//= require ./app/main
//= require_self

angular.element(document).ready(function() {
  'use strict';
  angular.bootstrap(document.querySelector('[data-main-app]'), [
    'id5',
  ], {
    strictDi: true,
  });
});
