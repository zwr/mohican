(function(MohicanUtils) {
  'use strict';

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

    initialize: function(resolve, mnGridFilterService, $stateParams, $state, $scope) {
      MohicanUtils.redirectDefaultParameters($stateParams, $state);
      MohicanUtils.injectDefaultParameters($stateParams);

      this.page = $stateParams.page;
      this.layout = $stateParams.layout;
      this.order = $stateParams.order;
      this.column = $stateParams.column;
      this.direction = $stateParams.direction;
      this.quickFilterShown = false;
      this.qfFocus = $stateParams.qf;//read focused field information from qf param
      this.filters = mnGridFilterService.urlParamToJson($stateParams.filters);
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
        });
        MohicanUtils.validateLayoutParameter(that.layout, that.layouts, that.$state, that.$stateParams);

        if(!that.resolve.fullyLoaded) {
          that.resolve.getBackendPageCount(that.fields).then(function(pageCount) {
            that.pageCount = pageCount;
            if(MohicanUtils.validatePageParameter(that.page, that.pageCount, that.$state, that.$stateParams)) {
              that.resolve.getBackendPage(that.page, that.fields).then(function(items) {
                that.items = items;
              });
            }
          });
        }
      });

      that.$scope.$watch(function() { return that.resolve.fullyLoaded; }, function (newValue) {
        if((that.$stateParams.column || that.$stateParams.qf) && newValue) {
          that.quickFilterShown = that.$stateParams.qf ? true : false;

          that.resolve.getClientPage(that.page,
                                     that.column,
                                     that.direction,
                                     that.filters).then(function(data) {
            that.items = data.items;
            that.pageCount = data.pageCount;
            MohicanUtils.validatePageParameter(that.page, that.pageCount, that.$state, that.$stateParams);
          });
        }
      });
    },

    getPage: function(page) {
      var newRouteParams = _.clone(this.$stateParams);
      newRouteParams.page = page;
      this.$state.go(this.$state.current.name, MohicanUtils.escapeDefaultParameters(newRouteParams));
    },

    getLayout: function(layout) {
      var newRouteParams = _.clone(this.$stateParams);
      newRouteParams.layout = layout;
      this.$state.go(this.$state.current.name, MohicanUtils.escapeDefaultParameters(newRouteParams));
    },

    getView: function(column, direction, filters, focus) {
      var newRouteParams = _.clone(this.$stateParams);
      newRouteParams.page = 1;//for all client side actions reset page to 1
      if(column) {
        newRouteParams.column = column;
      }
      if(direction) {
        newRouteParams.direction = direction;
      }
      if(filters) {
        newRouteParams.filters = this.mnGridFilterService.jsonToUrlParam(filters);
      }
      if(focus) {
        //store focused field information in qf param
        newRouteParams.qf = focus;
      }
      this.$state.go(this.$state.current.name, MohicanUtils.escapeDefaultParameters(newRouteParams));
    },

    toggleQuickFilter: function(opened) {
      var newRouteParams = _.clone(this.$stateParams);
      newRouteParams.qf = opened;
      if(!newRouteParams.qf) {
        newRouteParams.filters = undefined;
      }
      this.$state.go(this.$state.current.name, MohicanUtils.escapeDefaultParameters(newRouteParams));
    },
  };
}(window.MohicanUtils));
