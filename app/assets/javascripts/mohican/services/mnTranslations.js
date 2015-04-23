(function() {
  'use strict';

  angular
      .module('mohican.services')
      .factory('mnTranslations', [mnTranslations]);

  function mnTranslations() {
    var service = {};
    service.t = function(text) {
      // console.log('_t()');
      return window.MN_LANGUAGES[window.MN_LANGUAGE][text] || text;
    };

    return service;
  }

})();
