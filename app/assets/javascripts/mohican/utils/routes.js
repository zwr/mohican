angular
  .module('mnRoutes', []);

(function(mnUtils) {
  'use strict';

  mnUtils.routes = [];

  mnUtils.makeDefaultServiceResolvers = function() {
    var resolve = {};

    mnUtils.routes.forEach(function(routeName) {
      resolve[routeName + 'ServiceResolve'] = [
        routeName + 'Service',
        function (service) {
          return service;
        },
      ];
    });

    return resolve;
  };

  mnUtils.mohicanRoute = function(routeName, controller) {
    mnUtils.routes.push(routeName);
    controller.$inject = [routeName + 'ServiceResolve'];
    return function($stateProvider) {
      $stateProvider.state('base.' + routeName, {
        url: '/' + routeName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase(),
        templateUrl: 'app/routes/' + routeName + '/template.html',
        controller: controller,
        controllerAs: 'vm',
      });
    };
  };

  mnUtils.defineMohicanRoute = function(routeName, controller) {
    angular.module('mnRoutes').
        config(['$stateProvider', mnUtils.mohicanRoute(routeName, controller)]);
  };

}(window.MohicanUtils));
