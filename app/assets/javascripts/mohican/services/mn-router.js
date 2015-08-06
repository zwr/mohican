(function(mohican) {
  'use strict';

  angular
      .module('mohican.services')
      .controller('MainCtrl', ['$scope', function($scope) {
          $scope.name = 'World';
      }])
      .provider('mnRouter', [mnRouter]);

  function mnRouter() {
    var $urlRouterProviderRef = null;
    var $stateProviderRef = null;

    var provider = this;
    provider.routes = [];
    provider.stateChangeValidators = [];

    provider.init = function($urlRouterProvider, $stateProvider) {
      $urlRouterProviderRef = $urlRouterProvider;
      $stateProviderRef = $stateProvider;
    };

    provider.addResouceRoute = function(definition) {
      provider.routes.push(definition);
    };

    provider.addSimpleRoute = function(definition) {
      provider.addResouceRoute(definition);
    };

    provider.addRedirecRoute = function(definition) {
      provider.routes.push({
        name:       definition.name,
        redirectTo: definition.redirectTo
      });
    };

    this.$get = ['$stateParams', '$state', '$rootScope', function($stateParams, $state, $rootScope) {
      provider.transitionTo = $state.transitionTo;

      function createAll() {
        $state.transitionTo = function(to, toParams, options) {
          var denyTransitionTo = provider.stateChangeValidators.some(function(validator) {
            return !validator();
          });
          if(!denyTransitionTo) {
            return provider.transitionTo(to, toParams, options);
          }
          else {
            return provider.transitionTo($state.current.name, mohican.escapeDefaultParameters($stateParams), { notify: false });
          }
        };

        $urlRouterProviderRef.when('', '/');

        var has404 = false;
        provider.routes.forEach(function(route) {
          if(route.name === '404') { has404 = true; }
          mohican.defineMohicanRoute(route, $stateProviderRef);
        });

        if(!has404) {
          $stateProviderRef.state(mohican.toHyphen('404'), {
            url:         '/404',
            templateUrl: 'mohican/templates/404.html'
          });
        }

        $rootScope.$on('$stateChangeError', function() {
          provider.transitionTo('404', {});
        });

        $urlRouterProviderRef.otherwise('/404');
      }

      function redirectTo(routeName) {
        provider.transitionTo(routeName, $stateParams, {location: 'replace'});
      }

      function transitionTo(routeName, params, options) {
        if(options) {
          provider.transitionTo(routeName, params, options);
        }
        else {
          provider.transitionTo(routeName, params);
        }
      }

      function pageNotFound() {
        provider.transitionTo('404', {}, {location: 'replace'});
      }

      function addStateChageValidator(validator) {
        provider.stateChangeValidators.push(validator);
      }

      function removeStateChageValidator(validator) {
        var index = provider.stateChangeValidators.indexOf(validator);
        provider.stateChangeValidators.splice(index, 1);
      }

      function currenRouteName() {
        return $state.current.name;
      }

      return {
        createAll:    createAll,
        redirectTo:   redirectTo,
        transitionTo: transitionTo,
        pageNotFound: pageNotFound,
        $stateParams: $stateParams,
        $state:       $state,

        currenRouteName: currenRouteName,

        addStateChageValidator:    addStateChageValidator,
        removeStateChageValidator: removeStateChageValidator
      };
    }];
  }

})(window.mohican);
