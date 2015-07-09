(function(mohican) {
  'use strict';

  angular
      .module('mohican.services')
      .provider('mnRouter', [mnRouter]);

  function mnRouter() {
    var $urlRouterProviderRef = null;
    var $stateProviderRef = null;

    var provider = this;
    provider.routes = [];
    provider.stateChaneValidators = [];

    provider.init = function($urlRouterProvider, $stateProvider) {
      $urlRouterProviderRef = $urlRouterProvider;
      $stateProviderRef = $stateProvider;
      $stateProvider.state('base', {
        abstract: true,
        url:      '',
        views:    { '': { template: '<ui-view/>' } }
      });
    };

    provider.addResouceRoute = function(definition) {
      provider.routes.push(definition);
      if(angular.isDefined(definition.default)) {
        $urlRouterProviderRef.otherwise('/' + mohican.toHyphen(definition.name));
      }
    };

    provider.addSimpleRoute = function(definition) {
      provider.addResouceRoute(definition);
    };

    provider.addRedirecRoute = function(definition) {
      if(definition.name === null || definition.name === '') {
        $urlRouterProviderRef.otherwise('/' + mohican.toHyphen(definition.redirectTo));
      }
      else {
        provider.routes.push({
          name:       definition.name,
          redirectTo: definition.redirectTo
        });
      }
    };

    this.$get = ['$stateParams', '$state', function($stateParams, $state) {
      provider.transitionTo = $state.transitionTo;

      function createAll() {
        $state.transitionTo = function(to, toParams, options) {
          var denyTransitionTo = provider.stateChaneValidators.some(function(validator) {
            return !validator();
          });
          console.log(denyTransitionTo);
          if(!denyTransitionTo) {
            return provider.transitionTo(to, toParams, options);
          }
        };
        provider.routes.forEach(function(route) {
          mohican.defineMohicanRoute(route, $stateProviderRef);
        });
      }

      function redirectTo(routeName) {
        $state.go('base.' + routeName, $stateParams, {location: 'replace'});
      }

      function transitionTo(routeName, params, options) {
        // var denyTransitionTo = provider.stateChaneValidators.some(function(validator) {
        //   return !validator();
        // });
        // console.log(denyTransitionTo);
        // if(!denyTransitionTo) {
        //   console.log('allowed');
          $state.go(routeName, params, options);
        //   return true;
        // }
        // else {
        //   return false;
        // }
      }

      function addStateChageValidator(validator) {
        provider.stateChaneValidators.push(validator);
      }

      function removeStateChageValidator(validator) {
        var index = provider.stateChaneValidators.indexOf(validator);
        provider.stateChaneValidators.splice(index, 1);
      }

      return {
        createAll:    createAll,
        redirectTo:   redirectTo,
        transitionTo: transitionTo,
        $stateParams: $stateParams,
        $state:       $state,

        addStateChageValidator:    addStateChageValidator,
        removeStateChageValidator: removeStateChageValidator
      };
    }];
  }

})(window.mohican);
