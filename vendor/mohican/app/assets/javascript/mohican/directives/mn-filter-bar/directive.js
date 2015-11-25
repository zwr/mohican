//= require ./template
//= require ./controller
//= require_self
(function(mohican) {
  'use strict';
  angular.module('mohican')
    .directive('mnFilterBar', ['$compile', function($compile) {
        return {
          scope: {
            owner:         '=?',
            showNewButton: '@'
          },
          restrict:     'E',
          templateUrl:  'mohican/directives/mn-filter-bar/template.html',
          controller:   'MnFilterBarController',
          controllerAs: 'filterBar',
          transclude:   true,

          bindToController: true,

          compile: function(el, attributes) {
            return {
              post: function(scope, element, attrs, ctrl, transclusionFn) {
                scope.fbControls = [];
                ctrl.owner = scope.owner = mohican.scopeLookup(scope);
                transclusionFn(scope, function(clone) {
                  for(var i = 0; i < clone.length; i++) {
                    var elem = clone[i];

                    if(_.startsWith(elem.nodeName, 'MN')) {
                      scope.fbControls.push({
                        nodeName: elem.nodeName,
                        field:    elem.getAttribute ? elem.getAttribute('field') : null
                      });
                    }

                    if(elem.nodeName === 'MN-FB-DOCUMENT-FILTER-SELECTOR') {
                      var mnDirective = angular.element('<mn-filter-selector>');
                      mnDirective.attr('seleted-document-filters', 'filterBar.seletedDocumentFilters');
                      $compile(mnDirective)(scope);

                      angular.element(element.find('.mn-translude')[0]).append(mnDirective);
                    }
                    if(elem.nodeName === 'MN-FB-DATE-SELECTOR') {
                      var mnDirective = angular.element('<mn-filter-bar-date-selector>');
                      var field = elem.getAttribute('field');
                      var label = elem.getAttribute('label');
                      mnDirective.attr('date-from', 'filterBar.' + _.camelCase(field));
                      mnDirective.attr('label', label);
                      mnDirective.attr('field', field);
                      $compile(mnDirective)(scope);

                      angular.element(element.find('.mn-translude')[0]).append(mnDirective);
                    }
                    if(elem.nodeName === 'MN-FB-DATE-RANGE-SELECTOR') {
                      var mnDirective = angular.element('<mn-filter-bar-date-range-selector>');
                      var field = elem.getAttribute('field');
                      var label = elem.getAttribute('label');
                      mnDirective.attr('date-range', 'filterBar.' + _.camelCase(field));
                      mnDirective.attr('label', label);
                      mnDirective.attr('field', field);
                      $compile(mnDirective)(scope);

                      angular.element(element.find('.mn-translude')[0]).append(mnDirective);
                    }
                    if(elem.nodeName === 'MN-FB-MULTI-SELECTOR') {
                      var mnDirective = angular.element('<mn-filter-bar-multi-selector>');
                      var field = elem.getAttribute('field');
                      var values = elem.getAttribute('values');
                      var label = elem.getAttribute('label');
                      mnDirective.attr('selected-values', 'filterBar.selected' + _.capitalize(_.camelCase(field)));
                      mnDirective.attr('values', values);
                      mnDirective.attr('label', label);
                      mnDirective.attr('field', field);
                      $compile(mnDirective)(scope);

                      angular.element(element.find('.mn-translude')[0]).append(mnDirective);
                    }
                  }
                });
              }
            };
          }
        };
      }
    ]);
}(window.mohican));
