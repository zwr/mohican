//= require_self

(function() {
  'use strict';

  angular
      .module('mohican.directives')
      .controller('mnViewFieldController', [mnViewFieldController]);

  function mnViewFieldController() {
    var vm = this;

    vm.formatedModel = function() {
      if(!angular.isDefined(vm.model.formatted_values)) {
        vm.model.formatted_values = {};
      }
      if(angular.isDefined(vm.model.formatted_values[vm.field.name])) {
        return vm.model.formatted_values[vm.field.name];
      }

      var res;
      if(vm.field.view === 'date') {
        vm.field.format = 'DD.MM.YYYY.';//TODO: store format information in db
        res = (vm.model[vm.field.name] ? moment(vm.model[vm.field.name]).format(vm.field.format) : '');
      }
      else if(_.startsWith(vm.field.view, 'number')) {
        var decimalParams = vm.field.view.slice(7, vm.field.view.length - 1);
        res = (angular.isDefined(vm.model[vm.field.name]) ? vm.model[vm.field.name].toFixed(decimalParams) : '');
      }
      //vm.field.view === 'text'
      else {
        res = vm.model[vm.field.name];
      }
      if(!angular.isDefined(res)) {
        res = null;
      }
      return vm.model.formatted_values[vm.field.name] = res;
    };
  }
})();
