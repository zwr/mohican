//= require angular
//= rewuire mohican/lib
//= require_self

(function() {
  'use strict';

  angular
      .module('appHeaderControllerModule', ['mohican'])
      .controller('AppHeaderController', ['mnTranslations', AppHeaderController]);

  function AppHeaderController(mnTranslations) {
    var vm = this;

    angular.extend(vm, {
      appHeaderTranslations: mnTranslations.appHeader,
    });
  }
})();
