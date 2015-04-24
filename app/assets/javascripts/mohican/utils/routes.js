(function(MohicanUtils) {
  'use strict';

  angular
      .module('mohican.routes', []);

  MohicanUtils.routes = [];

  MohicanUtils.makeDefaultServiceResolvers = function() {
    var resolve = {};

    MohicanUtils.routes.forEach(function(routeName) {
      resolve[routeName + 'ServiceResolve'] = [
        routeName + 'Service',
        function (service) {
          return service;
        },
      ];
    });

    return resolve;
  };

  MohicanUtils._mohicanRoute = function(routeName, controller) {
    MohicanUtils.routes.push(routeName);
    controller.$inject = [routeName + 'ServiceResolve', '$stateParams', '$state'];
    return function($stateProvider) {
      $stateProvider.state('base.' + routeName, {
        url: '/' + MohicanUtils.toHyphen(routeName) + '?page&layout',
        templateUrl: 'app/routes/' + routeName + 'Grid.html',
        controller: controller,
        controllerAs: 'ctrl',
      });
    };
  };

  MohicanUtils.defineMohicanRoute = function(routeName, controller, service) {
    angular.module('mohican.routes').
        config(['$stateProvider', MohicanUtils._mohicanRoute(routeName, controller)]);
    angular.
        module('mohican.services').
        factory(routeName + 'Service', ['mnBaseService', '$http', '$q', service]);
  };

  MohicanUtils.escapeDefaultParameters = function(params) {
    if (params.page === '1') {
      params.page = undefined;
    }
    if (params.layout === 'default') {
      params.layout = undefined;
    }

    return params;
  };

  MohicanUtils.clearDefaultParameters = function(params, state) {
    var newParams = _.clone(params);
    var dirty = false;
    if (newParams.page === '1') {
      newParams.page = undefined;
      dirty = true;
    }
    if (newParams.layout === 'default') {
      newParams.layout = undefined;
      dirty = true;
    }

    if(dirty) {
      console.log(newParams);
      state.go(state.current.name, newParams);
    }
  };

  MohicanUtils.injectDefaultParameters = function(params) {
    if (!params.page) {
      params.page = '1';
    }
    if (!params.layout) {
      params.layout = 'default';
    }

    return params;
  };

  //HelloWorld -> hello-world
  MohicanUtils.toHyphen = function(string) {
    return _.kebabCase(string);
  };

  //hello-world -> helloWorld
  MohicanUtils.toCamel = function(string) {
    return _.camelCase(string);
  };

  //hello-world -> HelloWorld
  MohicanUtils.toCapitalCamel = function(string) {
    return _.chain(string).camelCase().capitalize().value();
  };

  //HelloWorld -> hello_world
  MohicanUtils.toSnake = function(string) {
    return _.snakeCase(string);
  };

}(window.MohicanUtils));
