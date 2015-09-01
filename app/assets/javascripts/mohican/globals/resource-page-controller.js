(function(mohican) {
  'use strict';

  mohican.extendResourcePageController = function(resourceName, ctrl, service, $injector) {
    _.assign(ctrl, mohican.createBaseDriver($injector));
    _.assign(ctrl, mohican.createResourcePageController());
    ctrl.resourceName = resourceName;
    ctrl.initialize(service, $injector);
    ctrl.loadData();
  };

  mohican.createResourcePageController = function() {
    return {
      backendFilters: undefined,
      layouts:        undefined,
      layoutDefs:     undefined,
      service:        undefined,
      fields:         undefined,
      pageCount:      undefined,
      totalQfCount:   undefined,
      primaryKeyName: undefined,
      itemForm:       undefined,
      mnRouter:       undefined,

      onCurrentItemChanged: undefined,

      clientViewLoadingNotification: undefined,

      initialize: function(service, $injector) {
        this.mnRouter = $injector.get('mnRouter');
        this.$q = $injector.get('$q');
        this.$http = $injector.get('$http');

        mohican.redirectDefaultParameters(this.mnRouter);
        mohican.injectDefaultParameters(this.mnRouter);

        this.stateMachine.stateMachineFromUrl(this.mnRouter.$stateParams, service);

        if(angular.isDefined(this.mnRouter.$stateParams.column) ||
              angular.isDefined(this.mnRouter.$stateParams.qf) ||
              angular.isDefined(this.mnRouter.$stateParams.filters)) {
          this.clientViewLoadingNotification = true;
        }
        else {
          this.clientViewLoadingNotification = false;
        }
        this.fullyLoaded = false;
        this.layouts = [];
        this.layoutDefs = [];
        this.backendFilters = [];
        this.service = service;
        this.onCurrentItemChanged = [];
      },

      loadMnGridItems: function() {
        var that = this;
        that.service.getBackendPageCount(that.fields, that.stateMachine.page, that.stateMachine.backendFilter).then(function(pageCount) {
          that.pageCount = pageCount;

          if(mohican.validatePageParameter(that.stateMachine.page, that.pageCount, that.mnRouter)) {
            that.service.getBackendPage(that.stateMachine.page, that.fields, that.stateMachine.backendFilter).then(function(items) {
              that.items = items;
              // We want to be careful to call waitFullyLoaded only when the
              // initial promise has returned! Now we are sure the eager loading
              // is ongoing.
              that.service.waitFullyLoaded().then(function() {
                that.fullyLoaded = true;
                if(that.stateMachine.column || that.stateMachine.quickFilterShown) {
                  that.stateMachine.page = parseInt(angular.isUndefined(that.mnRouter.$state.params.page) ? 1 : parseInt(that.mnRouter.$state.params.page));

                  that.service.getClientPage(that.stateMachine.page,
                                             that.stateMachine.column,
                                             that.stateMachine.direction,
                                             that.stateMachine.filters,
                                             that.fields).then(function(data) {
                    that.items = data.items;
                    that.pageCount = data.pageCount;
                    that.totalQfCount = data.totalQfCount;
                    mohican.validatePageParameter(that.stateMachine.page, that.pageCount, that.mnRouter);
                  });
                }
              });
            });
          }
        });
      },

      loadData: function() {
        var that = this;

        that.service.getPreviewDefinitions().
        then(function(definition) {
          that.primaryKeyName = definition.primaryKeyName;
          that.doctype = definition.doctype;
          that.layoutDefs = definition.layouts;
          that.layoutDefs.forEach(function(layout) {
            that.layouts.push({
              name:     layout.name,
              show:     'Layout: ' + layout.name,
              desc:     'Shows ' + layout.definition.length + ' fields',
              selected: layout.name === that.stateMachine.layout
            });
            if(layout.name === that.stateMachine.layout) {
              that.fields = layout.definition;
            }
          });
        }).
        then(function() {
          if(_.endsWith(that.mnRouter.currentRouteName(), '-new')) {
            that.fullyLoaded = true;
            that.itemForm = {};
            that.onCurrentItemChanged.forEach(function(callback) {
              callback(that.itemForm);
            });
            that.service.prepareNewDoc(that.fields, that.$http, that.$q, that.resourceName,
                                      {primaryKeyName: that.primaryKeyName, doctype: that.doctype}, that.itemForm);
          }
          else if(that.stateMachine.itemPrimaryKeyId) {
            that.service.getDocument(that.stateMachine.itemPrimaryKeyId, that.fields)
            .then(function(items) {
              that.fullyLoaded = true;
              ///check is item exists
              if(items[0]) {
                that.itemForm = items[0];
                that.onCurrentItemChanged.forEach(function(callback) {
                  callback(that.itemForm);
                });
              }
              else {
                that.mnRouter.pageNotFound();
              }
            });
          }
          else {
            mohican.validateLayoutParameter(that.stateMachine.layout, that.layouts, that.mnRouter);
            that.service.getBackendFilters().then(function(backendFilters) {
              backendFilters.forEach(function(backendFilter) {
                that.backendFilters.push({
                  name:     backendFilter.name,
                  show:     'Filter: ' + backendFilter.name,
                  selected: backendFilter.name === that.stateMachine.backendFilter
                });
              });
              mohican.validateBackendFilterParameter(that.stateMachine.backendFilter, that.backendFilters, that.mnRouter);
            });
            that.stateMachine.filters = mohican.urlParamToJson(that.mnRouter.$stateParams.filters, that.fields);

            that.fullyLoaded = false;

            that.loadMnGridItems();
          }
        });
      },

      pageChanged: function(page) {
        var that = this;
        if(this.service.thePromise !== null) {
          this.stateMachine.page = parseInt(page);
          // this.stateMachine.layout = undefined;
          this.stateMachine.column = undefined;
          this.stateMachine.direction = undefined;
          this.stateMachine.quickFilterShown = false;
          this.stateMachine.filters = undefined;

          this.mnRouter.transitionTo(this.mnRouter.currentRouteName(),
                         this.stateMachine.stateMachineToUrl(this.fields),
                         { notify: true });
        }
        else {
          var pageBefore = that.stateMachine.page;
          that.stateMachine.page = parseInt(page);
          this.mnRouter.transitionTo(this.mnRouter.currentRouteName(),
                         this.stateMachine.stateMachineToUrl(this.fields),
                         { notify: false })
                       .then(function() {
                         that.service.getClientPage(that.stateMachine.page,
                                                    that.stateMachine.column,
                                                    that.stateMachine.direction,
                                                    that.stateMachine.filters,
                                                    that.fields).then(function(data) {
                           that.stateMachine.page = parseInt(page);
                           that.items = data.items;
                           that.pageCount = data.pageCount;
                           that.totalQfCount = data.totalQfCount;
                           mohican.validatePageParameter(that.stateMachine.page, that.pageCount, that.mnRouter);
                         });
                       }, function() {
                         //TODO: make it better
                         //if transitionTo validations is rejected,
                         //rollback stateMachine
                         that.stateMachine.page = pageBefore;
                       });
        }
      },

      clientLayoutChanged: function(newLayoutName) {
        var deffered = this.$q.defer();
        var that = this;

        var fieldsBefore = _.clone(that.fields);
        var layoutBefore = that.stateMachine.layout;

        that.layoutDefs.forEach(function(layout) {
          if(layout.name === newLayoutName) {
            that.stateMachine.layout = newLayoutName;
          }
        });

        this.mnRouter.transitionTo(this.mnRouter.currentRouteName(),
                       this.stateMachine.stateMachineToUrl(this.fields),
                       { notify: false }).
                      then(function() {
                        that.stateMachine.page = 1;
                        that.layoutDefs.forEach(function(layout) {
                          if(layout.name === newLayoutName) {
                            that.fields = layout.definition;
                            that.stateMachine.layout = newLayoutName;
                          }
                        });
                        deffered.resolve();
                      }, function() {
                        that.fields = _.clone(fieldsBefore);
                        that.stateMachine.layout = layoutBefore;
                        deffered.reject();
                      });

        return deffered.promise;
      },

      getBackendFilter: function(backendFilter) {
        var deffered = this.$q.defer();

        var newRouteParams = _.clone(this.mnRouter.$stateParams);
        newRouteParams.page = undefined;
        // newRouteParams.layout = undefined;
        newRouteParams.column = undefined;
        newRouteParams.direction = undefined;
        newRouteParams.quickFilterShown = false;
        newRouteParams.filters = undefined;
        newRouteParams.backendfilter = backendFilter;
        this.mnRouter.transitionTo(this.mnRouter.currentRouteName(), mohican.escapeDefaultParameters(newRouteParams)).
                      then(function() {
                        deffered.resolve();
                      }, function() {
                        deffered.reject();
                      });

        return deffered.promise;
      },

      clientViewChanged: function(column, direction) {
        var deffered = this.$q.defer();
        var that = this;

        var columnBefore = that.stateMachine.column;
        var directionBefore = that.stateMachine.direction;
        var pageBefore = that.stateMachine.page;

        if(column) {
          that.stateMachine.column = column;
        }
        if(direction) {
          that.stateMachine.direction = direction;
        }
        that.stateMachine.page = 1;//for all client side actions reset page to 1

        this.mnRouter.transitionTo(this.mnRouter.currentRouteName(),
                       this.stateMachine.stateMachineToUrl(this.fields),
                       { notify: false }).
                      then(function() {
                        that.service.getClientPage(that.stateMachine.page,
                                                   that.stateMachine.column,
                                                   that.stateMachine.direction,
                                                   that.stateMachine.filters,
                                                   that.fields).then(function(data) {
                          that.items = data.items;
                          that.pageCount = data.pageCount;
                          that.totalQfCount = data.totalQfCount;
                          mohican.validatePageParameter(that.stateMachine.page, that.pageCount, that.mnRouter);

                          deffered.resolve();
                        });
                      }, function() {
                        //TODO: make it better
                        //if transitionTo validations is rejected,
                        //rollback stateMachine
                        // console.log(filtersBefore);
                        // that.stateMachine.filters = filtersBefore;
                        that.stateMachine.column = columnBefore;
                        that.stateMachine.direction = directionBefore;
                        that.stateMachine.page = pageBefore;

                        deffered.reject();
                      });
        return deffered.promise;
      },

      toggleQuickFilter: function() {
        var that = this;
        var quickFilterShownBefore = that.stateMachine.quickFilterShown;
        var pageBefore = that.stateMachine.page;
        var filtersBefore = _.cloneDeep(that.stateMachine.filters);

        that.stateMachine.page = 1;//for all client side actions reset page to 1
        that.stateMachine.quickFilterShown = !that.stateMachine.quickFilterShown;
        if(!that.stateMachine.quickFilterShown) {
          that.stateMachine.filters = undefined;
        }

        this.mnRouter.transitionTo(this.mnRouter.currentRouteName(),
                       this.stateMachine.stateMachineToUrl(this.fields),
                       { notify: false }).
                      then(function() {
                        that.service.getClientPage(that.stateMachine.page,
                                                   that.stateMachine.column,
                                                   that.stateMachine.direction,
                                                   that.stateMachine.filters,
                                                   that.fields).then(function(data) {
                          that.items = data.items;
                          that.pageCount = data.pageCount;
                          that.totalQfCount = data.totalQfCount;
                          mohican.validatePageParameter(that.stateMachine.page, that.pageCount, that.mnRouter);
                        });
                      }, function() {
                        //TODO: make it better
                        //if transitionTo validations is rejected,
                        //rollback stateMachine
                        that.stateMachine.quickFilterShown = quickFilterShownBefore;
                        that.stateMachine.filters = filtersBefore;
                        that.stateMachine.page = pageBefore;
                      });
      },

      clearClientSortAndFilter: function() {
        this.stateMachine.page = undefined;
        // this.stateMachine.layout = undefined;
        this.stateMachine.column = undefined;
        this.stateMachine.direction = undefined;
        this.stateMachine.quickFilterShown = false;
        this.stateMachine.filters = undefined;

        this.mnRouter.transitionTo(this.mnRouter.currentRouteName(),
                       this.stateMachine.stateMachineToUrl(this.fields),
                       { notify: true });
      },

      createSubDocsBasicDriver: function($injector, collectionName, fields) {
        var basicDrv = mohican.createBasicDriver($injector, collectionName, fields);
        _.assign(basicDrv, mohican.mixins.dataFieldsMixin);

        this.onCurrentItemChanged.push(function(newCurrentItem) {
          if(!newCurrentItem[basicDrv.collectionName]) {
            newCurrentItem[basicDrv.collectionName] = [];
          }
          basicDrv.items = newCurrentItem[basicDrv.collectionName];
        });

        return basicDrv;
      }
    };
  };
}(window.mohican));
