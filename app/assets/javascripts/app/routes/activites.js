//= require_self

(function(MohicanUtils) {
  'use strict';

  MohicanUtils.defineMohicanRoute({
    name: 'activities',
    controller: ['service', 'mnGridFilterService', '$stateParams', '$state', '$scope',
      function(resolve, mnGridFilterService, $stateParams, $state, $scope) {
        _.assign(this, MohicanUtils.mnBaseController);
        this.initialize(resolve, mnGridFilterService, $stateParams, $state, $scope);
        this.loadData();
        this.reportLocation = '/reports';
        this.attached = false;
        this.printMe = function(item) {
          $('#printf').attr('src', "/id.pdf");
          if(!this.attached) {
            this.attached = true;
            $('#printf').load(function() {
              window.frames["printf"].focus();
              window.frames["printf"].print();
            });
          }
        };
      }
    ],
    service: ['$http', '$q', function ($http, $q) {
      var service = MohicanUtils.mnBaseFactory('activities', $http, $q);
      // do a lot of stuff
      return service;
    }]
  });
})(window.MohicanUtils);
