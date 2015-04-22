//= require_self

(function() {
  'use strict';

  angular
      .module('id5.directives')
      .controller('AppHeaderController', ['mnTranslations', AppHeaderController]);

  function AppHeaderController(mnTranslations) {
    this.t = mnTranslations.t;
  }
})();
