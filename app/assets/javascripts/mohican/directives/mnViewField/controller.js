//= require_self

(function() {
  'use strict';

  angular
      .module('mohican.directives')
      .controller('mnViewFieldController', [mnViewFieldController]);

  function mnViewFieldController() {
    var vm = this;

    vm.formatedModel = function() {
      if(vm.field.view === 'date') {
        vm.field.format = 'DD.MM.YYYY.';//TODO: store format information in db
        return vm.model ? moment(vm.model).format(vm.field.format) : '';
      }
      else if(_.startsWith(vm.field.view, 'number')) {
        var decimalParams = vm.field.view.slice(7, vm.field.view.length - 1);
        return vm.model ? vm.model.toFixed(decimalParams) : '';
      }
      //vm.field.view === 'text'
      else {
        return vm.model;
      }
    };
  }
})();
