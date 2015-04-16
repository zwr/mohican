(function(MohicanUtils) {
  'use strict';

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

  MohicanUtils.mohicanRoute = function(routeName, controller) {
    MohicanUtils.routes.push(routeName);
    controller.$inject = [routeName + 'ServiceResolve'];
    return function($stateProvider) {
      $stateProvider.state('base.' + routeName, {
        url: '/' + MohicanUtils.toHyphen(routeName) + '?page&layout',
        templateUrl: 'app/routes/' + routeName + '/template.html',
        controller: controller,
        controllerAs: 'ctrl',
      });
    };
  };

  MohicanUtils.defineMohicanRoute = function(routeName, controller) {
    angular.module('mohican.routes').
        config(['$stateProvider', MohicanUtils.mohicanRoute(routeName, controller)]);
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
