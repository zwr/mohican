//= require_self

(function() {
  'use strict';

  angular
      .module('id5AppHeaderModule')
      .controller('AppHeaderController', ['mnTranslations', AppHeaderController]);

  function AppHeaderController(mnTranslations) {
    var vm = this;

    angular.extend(vm, {
      appHeaderTranslations: mnTranslations.appHeader,
    });
  }
})();
