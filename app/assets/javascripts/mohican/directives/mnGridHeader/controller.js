//= require_self

(function() {
  'use strict';

  angular
      .module('mohican.directives')
      .controller('MnGridHeaderController', [MnGridHeaderController]);

  function MnGridHeaderController() {
    var vm = this;

    // vm._layoutChanged = function(layout) {
    //   console.log(layout);
    // };

    // vm.layoutsFix = [
    //    {	icon: '[...]/opera.png...',	name: 'Opera',	maker: 'Opera Software',	ticked: true	},
    //    {	icon: '[...]/internet_explorer.png...',	name: 'Internet Explorer',	maker: 'Microsoft',	ticked: false	},
    //    {	icon: '[...]/firefox-icon.png...',	name: 'Firefox',	maker: 'Mozilla Foundation',	ticked: true	},
    //    {	icon: '[...]/safari_browser.png...',	name: 'Safari',	maker: 'Apple',	ticked: false	},
    //    {	icon: '[...]/chrome.png...',	name: 'Chrome',	maker: 'Google',	ticked: true	},
    // ];

    /*
      multi-select directive can't work directly with
      bindToController variables if helper-elements="none"
    */
    vm.layoutsFix = vm.layouts;
  }
})();
