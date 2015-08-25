(function(mohican) {
  'use strict';

  angular
      .module('mohican')
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
      function createAll() {
        var lcs = $rootScope.$on('$locationChangeStart', function (event, next, current) {
          var nextWithNoParams = next.split('?')[0];
          var currentWithNoParams = current.split('?')[0];
          //do not validate if only after '?' param is changed
          if(nextWithNoParams !== currentWithNoParams) {
            var denyTransitionTo = provider.stateChangeValidators.some(function(validator) {
              return !validator();
            });
            if (denyTransitionTo) {
              event.preventDefault();
            }
          }
        });

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

        var scr = $rootScope.$on('$stateChangeError', function() {
          $state.transitionTo('404', {});
        });

        $urlRouterProviderRef.otherwise('/404');
      }

      function redirectTo(routeName) {
        $state.transitionTo(routeName, $stateParams, {location: 'replace'});
      }

      function transitionTo(routeName, params, options) {
        if(options) {
          $state.transitionTo(routeName, params, options);
        }
        else {
          $state.transitionTo(routeName, params);
        }
      }

      function pageNotFound() {
        $state.transitionTo('404', {}, {location: 'replace'});
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
