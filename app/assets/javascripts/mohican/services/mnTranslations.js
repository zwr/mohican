(function() {
  'use strict';

  angular
      .module('mohican.services')
      .factory('mnTranslations', [mnTranslations]);

  function mnTranslations() {
    var _service = {
      t: _t,
    };

    return _service;
  }

  function _t(text) {
    // console.log('_t()');
    return window.MN_LANGUAGES[window.MN_LANGUAGE][text] || text;
  }

})();
