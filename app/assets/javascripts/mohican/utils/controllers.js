(function(MohicanUtils) {
  'use strict';

  MohicanUtils.mnBaseController = {
    page: undefined,
    layout: undefined,
    layouts: undefined,
    resolve: undefined,
    $stateParams: undefined,
    $state: undefined,
    fields: undefined,
    pagesCount: undefined,
    item: undefined,

    initialize: function(resolve, $stateParams, $state, $location) {
      MohicanUtils.redirectDefaultParameters($stateParams, $state);
      MohicanUtils.injectDefaultParameters($stateParams);

      this.page = $stateParams.page;
      this.layout = $stateParams.layout;
      this.layouts = [];
      this.resolve = resolve;
      this.$stateParams = $stateParams;
      this.$state = $state;

      if(this.page === "1") {
        $location.url($location.url().replace("page=1&","").replace("&page=1","").replace("?page=1",""));
      }

      var that = this;

      resolve.getPageCount().then(function(pagesCount) {
        that.pagesCount = pagesCount;
        if(MohicanUtils.checkPageParameter(that.page, that.pagesCount, that.$state, that.$stateParams)) {
          resolve.getPage(that.page).then(function(items) {
            that.items = items;
          });
        }
      });

      resolve.getPreviewDefinitions().then(function(definition) {
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
        MohicanUtils.checkLayoutParameter(that.layout, that.layouts, $state, $stateParams);
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
  };
}(window.MohicanUtils));
