(function(mohican) {
  'use strict';

  var defaultParams = {
    type:           undefined,
    dismissable:    true,
    delay:          false,
    message:        undefined,
    details:        undefined,
    fullyClickable: false
  };

  mohican.mnsMessage = {
    create: function(options) {
      var msg = _.assign({}, defaultParams, options);
      return msg;
    }
  };
}(window.mohican));
