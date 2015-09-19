(function(mohican) {
  'use strict';

  var defaultParams = {
    type:           undefined,
    dismissable:    true,
    delay:          false,
    message:        undefined,
    details:        undefined,
    fullyClickable: false,
    buffer:         []
  };

  mohican.mnsMessage = {
    create: function(options) {
      var msg = _.assign({}, defaultParams, options);


      msg.clear = function(reason) {
        var index = this.buffer.indexOf(this);
        this.buffer.splice(index, 1);
        this.q.resolve(reason);
      };

      return msg;
    }
  };
}(window.mohican));
