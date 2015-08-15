//= require_self

(function() {
  'use strict';

  angular
      .module('mohican')
      .controller('MnTabsController', [MnTabsController]);

  function MnTabsController() {
    var vm = this;
    vm.tabs = [];

    vm.addTab = function addTab(tab) {
      vm.tabs.push(tab);
    };
    vm.setSelectedTab = function(tabIndex) {
      vm.tabs.forEach(function(tab, index) {
        if(index.toString() === tabIndex) {
          tab.active = true;
        }
        else {
          tab.active = false;
        }
      });
    };
    vm.select = function(selectedTab) {
      angular.forEach(vm.tabs, function(tab, index) {
        if(tab.active && tab !== selectedTab) {
          tab.active = false;
        }
        if(tab === selectedTab) {
          vm.owner.stateMachine.activetab = index;
        }
      });

      selectedTab.active = true;
      vm.owner.mnRouter.transitionTo(vm.owner.mnRouter.$state.current.name,
                     vm.owner.stateMachine.stateMachineToUrl(),
                     { notify: false });
    };
  }
})();
