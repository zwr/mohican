//= require_self

(function() {
  'use strict';

  angular
      .module('mohican.directives')
      .controller('MnTabsController', [MnTabsController]);

  function MnTabsController() {
    var vm = this;
    vm.tabs = [];
    vm.addTab = function addTab(tab) {
      vm.tabs.push(tab);

      if(vm.tabs.length === 1) {
        tab.active = true;
      }
    };
    vm.select = function(selectedTab) {
      angular.forEach(vm.tabs, function(tab) {
        if(tab.active && tab !== selectedTab) {
          tab.active = false;
        }
      });

      selectedTab.active = true;
    };
  }
})();
