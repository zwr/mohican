(function(mohican) {
  'use strict';

  mohican.extendResourcePageController = function(ctrl, service, mnRouter) {
    _.assign(ctrl, mohican.createBaseDriver());
    _.assign(ctrl, mohican.createResourcePageController());
    ctrl.initialize(service, mnRouter);
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

      initialize: function(service, mnRouter) {
        mohican.redirectDefaultParameters(mnRouter);
        mohican.injectDefaultParameters(mnRouter);

        this.mnRouter = mnRouter;

        this.stateMachine.stateMachineFromUrl(mnRouter.$stateParams, service);

        if(angular.isDefined(mnRouter.$stateParams.column) ||
              angular.isDefined(mnRouter.$stateParams.qf) ||
              angular.isDefined(mnRouter.$stateParams.filters)) {
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

      loadData: function() {
        var that = this;

        that.service.getPreviewDefinitions().
        then(function(definition) {
          that.primaryKeyName = definition.primaryKeyName;
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
          if(that.stateMachine.itemPrimaryKeyId) {
            that.service.getDocument(that.stateMachine.itemPrimaryKeyId, that.fields, that.primaryKeyName)
            .then(function(items) {
              that.itemForm = items[0];
              that.onCurrentItemChanged.forEach(function(callback) {
                callback(that.itemForm);
              });
            });
            return;
          }
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

          this.mnRouter.transitionTo(this.mnRouter.currenRouteName(),
                         this.stateMachine.stateMachineToUrl(this.fields),
                         { notify: true });
        }
        else {
          this.stateMachine.page = parseInt(page);
          this.mnRouter.transitionTo(this.mnRouter.currenRouteName(),
                         this.stateMachine.stateMachineToUrl(this.fields),
                         { notify: false });
          this.service.getClientPage(this.stateMachine.page,
                                     this.stateMachine.column,
                                     this.stateMachine.direction,
                                     this.stateMachine.filters,
                                     this.fields).then(function(data) {
            that.items = data.items;
            that.pageCount = data.pageCount;
            that.totalQfCount = data.totalQfCount;
            mohican.validatePageParameter(that.stateMachine.page, that.pageCount, that.mnRouter);
          });
        }
      },

      clientLayoutChanged: function(newLayoutName) {
        this.stateMachine.page = 1;
        var that = this;
        this.layoutDefs.forEach(function(layout) {
          if(layout.name === newLayoutName) {
            that.fields = layout.definition;
            that.stateMachine.layout = newLayoutName;
          }
        });
        this.mnRouter.transitionTo(this.mnRouter.currenRouteName(),
                       this.stateMachine.stateMachineToUrl(this.fields),
                       { notify: false });
      },

      getBackendFilter: function(backendFilter) {
        var newRouteParams = _.clone(this.mnRouter.$stateParams);
        newRouteParams.backendfilter = backendFilter;
        this.mnRouter.transitionTo(this.mnRouter.currenRouteName(), mohican.escapeDefaultParameters(newRouteParams));
      },

      clientViewChanged: function(column, direction) {
        this.stateMachine.page = 1;//for all client side actions reset page to 1
        if(column) {
          this.stateMachine.column = column;
        }
        if(direction) {
          this.stateMachine.direction = direction;
        }

        this.mnRouter.transitionTo(this.mnRouter.currenRouteName(),
                       this.stateMachine.stateMachineToUrl(this.fields),
                       { notify: false });
         var that = this;
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
      },

      toggleQuickFilter: function() {
        if(!this.stateMachine.quickFilterShown) {
          this.stateMachine.filters = undefined;
        }
        this.stateMachine.page = 1;//for all client side actions reset page to 1

        this.mnRouter.transitionTo(this.mnRouter.currenRouteName(),
                       this.stateMachine.stateMachineToUrl(this.fields),
                       { notify: false });
         var that = this;
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
      },

      clearClientSortAndFilter: function() {
        this.stateMachine.page = undefined;
        // this.stateMachine.layout = undefined;
        this.stateMachine.column = undefined;
        this.stateMachine.direction = undefined;
        this.stateMachine.quickFilterShown = false;
        this.stateMachine.filters = undefined;

        this.mnRouter.transitionTo(this.mnRouter.currenRouteName(),
                       this.stateMachine.stateMachineToUrl(this.fields),
                       { notify: true });
      },

      createBasicDriver: function(collectionName, fields) {
        var basicDrv = mohican.createBasicDriver(collectionName, fields);

        this.onCurrentItemChanged.push(function(newCurrentItem) {
          basicDrv.items = [];
          if(newCurrentItem[basicDrv.collectionName]) {
            basicDrv.items = newCurrentItem[basicDrv.collectionName];
            basicDrv.items.forEach(function(item) {
              for(var key in item) {
                item['_' + key + '_formatted'] = item[key];
              }
            });
          }
        });

        return basicDrv;
      }
    };
  };
}(window.mohican));
