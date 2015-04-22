//= require_self

(function() {
  'use strict';

  angular
      .module('id5.directives')
      .controller('AppHeaderController', ['mnTranslations', AppHeaderController]);

  function AppHeaderController(mnTranslations) {
    var vm = this;

    angular.extend(vm, {
      t: mnTranslations.t,
    });
  }
})();
