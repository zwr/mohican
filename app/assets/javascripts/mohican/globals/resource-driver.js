(function(mohican) {
  'use strict';

  mohican.extendResourceDriver = function(resourceName, ctrl, service, $injector) {
    mohican.extendBaseDriver(ctrl, $injector);
    _.assign(ctrl, mohican.createResourceDriver());
    ctrl.resourceName = resourceName;

    ctrl.stateMachine.quickFilterShown = true;
    ctrl.stateMachine.page = 1;
    ctrl.stateMachine.layout = 'default';
    ctrl.stateMachine.documentFilter = 'default';

    ctrl.initialize(service);
    ctrl.loadData();
  };

  mohican.createResourceDriver = function() {
    return {
      documentFilters: undefined,
      layouts:         undefined,
      layoutDefs:      undefined,
      service:         undefined,
      fields:          undefined,
      pageCount:       undefined,
      totalQfCount:    undefined,
      primaryKeyName:  undefined,
      itemForm:        undefined,

      initialize: function(service) {
        this.fullyLoaded = false;
        this.layouts = [];
        this.layoutDefs = [];
        this.documentFilters = [];
        this.service = service;
      },

      loadData: function() {
        var that = this;

        that.service.getPreviewDefinitions().
        then(function(definition) {
          that.primaryKeyName = definition.primaryKeyName;
          that.layoutDefs = definition.layouts;
          that.layoutDefs.forEach(function(layout) {
            if(layout.name === that.stateMachine.layout) {
              that.fields = layout.definition;
            }
          });
        }).
        then(function() {
          that.service.getBackendPageCount(that.fields, that.stateMachine.page, that.stateMachine.documentFilter, mohican.openfiltersToBackendUrlParam(that.stateMachine.openfilters)).then(function(pageCount) {
            that.pageCount = pageCount;
            that.service.getBackendPage(that.stateMachine.page, that.fields, that.stateMachine.documentFilter, mohican.openfiltersToBackendUrlParam(that.stateMachine.openfilters)).then(function(items) {
              that.items = items;
              that.service.waitFullyLoaded().then(function() {
                that.fullyLoaded = true;
              });
            });
          });
        });
      },

      pageChanged: function(page) {
        var that = this;
        if(this.service.thePromise === null) {
          this.stateMachine.page = parseInt(page);
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

      clientViewChanged: function(column, direction) {
        this.stateMachine.page = 1;//for all client side actions reset page to 1
        if(column) {
          this.stateMachine.column = column;
        }
        if(direction) {
          this.stateMachine.direction = direction;
        }

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
      }
    };
  };
}(window.mohican));
