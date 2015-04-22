//= require_self

(function() {
  'use strict';

  angular
      .module('id5.directives')
      .controller('AppHeaderController', ['mnTranslations', '$scope', AppHeaderController]);

  function AppHeaderController(mnTranslations, $scope) {
    $scope.t: mnTranslations.t;
  }
})();
