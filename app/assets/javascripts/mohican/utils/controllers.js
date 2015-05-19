(function(MohicanUtils) {
  'use strict';
  trace_timestamp("Executing controller");
  MohicanUtils.mnBaseController = {
    page: undefined,
    layout: undefined,
    column: undefined,
    direction: undefined,
    quickFilterShown: undefined,
    qfFocus: undefined,
    filters: undefined,
    layouts: undefined,
    resolve: undefined,
    mnGridFilterService: undefined,
    $stateParams: undefined,
    $state: undefined,
    fields: undefined,
    pageCount: undefined,
    item: undefined,
    clientViewLoadingNotification: undefined,

    initialize: function(resolve, mnGridFilterService, $stateParams, $state, $scope) {
      trace_timestamp("Controller initialized");
      MohicanUtils.redirectDefaultParameters($stateParams, $state);
      MohicanUtils.injectDefaultParameters($stateParams);

      this.page = $stateParams.page;
      this.layout = $stateParams.layout;
      this.order = $stateParams.order;
      this.column = $stateParams.column;
      this.direction = $stateParams.direction;
      this.quickFilterShown = false;
      if(angular.isDefined($stateParams.column) ||
            angular.isDefined($stateParams.qf) ||
            angular.isDefined($stateParams.filters)) {
        this.clientViewLoadingNotification = true;
      }
      else {
        this.clientViewLoadingNotification = false;
      }
      this.fullyLoaded = false;
      this.qfFocus = $stateParams.qf;//read focused field information from qf param
      this.layouts = [];
      this.resolve = resolve;
      this.mnGridFilterService = mnGridFilterService;
      this.$stateParams = $stateParams;
      this.$state = $state;
      this.$scope = $scope;
    },

    loadData: function() {
      var that = this;

      that.resolve.getPreviewDefinitions().then(function(definition) {
        trace_timestamp('Started getPreviewDefinitions.');
        definition.layouts.forEach(function(layout) {
          that.layouts.push({
            name: layout.name,
            show: 'Layout: ' + layout.name,
            desc: 'Shows ' + layout.definition.length + ' fields',
            selected: layout.name === that.layout,
          });
          if(layout.name === that.layout) {
            that.fields = layout.definition;
          }
          trace_timestamp('done with the layout navigation iteration');
        });
        MohicanUtils.validateLayoutParameter(that.layout, that.layouts, that.$state, that.$stateParams);
        that.filters = that.mnGridFilterService.urlParamToJson(that.$stateParams.filters, that.fields);

        that.fullyLoaded = false;
        that.resolve.getBackendPageCount(that.fields, that.$state.params.page).then(function(pageCount) {
          that.pageCount = pageCount;
          if(MohicanUtils.validatePageParameter(that.page, that.pageCount, that.$state, that.$stateParams)) {
            that.resolve.getBackendPage(that.page, that.fields).then(function(items) {
              that.items = items;
              // We want to be careful to call waitFullyLoaded only when the
              // initial promise has returned! Now we are sure the eager loading
              // is ongoing.
              that.resolve.waitFullyLoaded().then(function() {
                that.fullyLoaded = true;
                if(that.$stateParams.column || that.$stateParams.qf) {
                  that.quickFilterShown = that.$stateParams.qf ? true : false;

                  that.resolve.getClientPage(that.page,
                                             that.column,
                                             that.direction,
                                             that.filters,
                                             that.fields).then(function(data) {
                    that.items = data.items;
                    that.pageCount = data.pageCount;
                    MohicanUtils.validatePageParameter(that.page, that.pageCount, that.$state, that.$stateParams);
                  });
                }
                trace_timestamp("done with the watcher");
              });            });
          }
          trace_timestamp("done with the page count");
        });
        trace_timestamp("done with the resolving");
      });
    },

    getPage: function(page) {
      trace_timestamp("Started getPage.")
      var newRouteParams = _.clone(this.$stateParams);
      newRouteParams.page = page;
      trace_timestamp("now setting state again");
      this.$state.go(this.$state.current.name, MohicanUtils.escapeDefaultParameters(newRouteParams));
    },

    getLayout: function(layout) {
      trace_timestamp("Started getLayout.")
      var newRouteParams = _.clone(this.$stateParams);
      newRouteParams.layout = layout;
      trace_timestamp("now setting state again2");
      this.$state.go(this.$state.current.name, MohicanUtils.escapeDefaultParameters(newRouteParams));
    },

    getView: function(column, direction, filters, focus) {
      trace_timestamp("Started getView.")
      var newRouteParams = _.clone(this.$stateParams);
      newRouteParams.page = 1;//for all client side actions reset page to 1
      if(column) {
        newRouteParams.column = column;
      }
      if(direction) {
        newRouteParams.direction = direction;
      }
      if(filters) {
        newRouteParams.filters = this.mnGridFilterService.jsonToUrlParam(filters, this.fields);
      }
      if(focus) {
        //store focused field information in qf param
        newRouteParams.qf = focus;
      }
      trace_timestamp("now setting state again3");
      this.$state.go(this.$state.current.name, MohicanUtils.escapeDefaultParameters(newRouteParams));
    },

    toggleQuickFilter: function(opened) {
      var newRouteParams = _.clone(this.$stateParams);
      newRouteParams.qf = opened;
      if(!newRouteParams.qf) {
        newRouteParams.filters = undefined;
      }
      trace_timestamp("now setting state again4");
      this.$state.go(this.$state.current.name, MohicanUtils.escapeDefaultParameters(newRouteParams));
    },

    clearClientSortAndFilter: function() {
      var newRouteParams = _.clone(this.$stateParams);

      newRouteParams.page = undefined;
      newRouteParams.layout = undefined;
      newRouteParams.column = undefined;
      newRouteParams.direction = undefined;
      newRouteParams.qf = undefined;
      newRouteParams.filters = undefined;

      this.$state.go(this.$state.current.name, newRouteParams);
    },
  };
}(window.MohicanUtils));
