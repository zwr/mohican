(function(mohican) {
  'use strict';
  mohican.scopeLookup = function(scope) {
    var i, owner, runner = scope;
    for(i = 0; (!scope.owner) && i < 10; i++) {
      if(runner.$parent && runner.$parent.ctrl) {
        owner = runner.$parent.ctrl;
        break;
      }
      runner = runner.$parent;
    }
    return owner;
  };
}(window.mohican));
