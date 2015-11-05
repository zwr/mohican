(function(mohican) {
  'use strict';

  mohican.extendResourcePageController = function(resourceName, routeName, ctrl, service, $injector) {
    mohican.extendBaseDriver(ctrl, $injector);
    _.assign(ctrl, mohican.createResourcePageController());
    ctrl.resourceName = resourceName;
    ctrl.routeName = routeName;
    ctrl.initialize(service, $injector);
    ctrl.loadData();
  };

  mohican.createResourcePageController = function() {
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
      mnRouter:        undefined,

      onCurrentItemChanged: undefined,

      initialize: function(service, $injector) {
        var that = this;
        this.mnRouter = $injector.get('mnRouter');
        this.$q = $injector.get('$q');
        this.$http = $injector.get('$http');
        this.mnNotify = $injector.get('mnNotify');

        mohican.redirectDefaultParameters(this.mnRouter);
        mohican.injectDefaultParameters(this.mnRouter);

        this.stateMachine.stateMachineFromUrl(this.mnRouter.$stateParams, service);

        this.fullyLoaded = false;
        this.layouts = [];
        this.layoutDefs = [];
        this.documentFilters = [];
        this.service = service;
        this.onCurrentItemChanged = [];
      },

      loadMnGridItems: function() {
        var that = this;
        that.service.getBackendPageCount(that.fields, that.stateMachine.page, that.stateMachine.documentFilter, mohican.openfiltersToBackendUrlParam(that.stateMachine.openfilters)).then(function(resolveValue) {
          var pageCount = resolveValue.pageCount;
          var alreadyLoadedData = resolveValue.alreadyLoadedData;
          that.pageCount = pageCount;

          if(mohican.validatePageParameter(that.stateMachine.page, that.pageCount, that.mnRouter)) {
            that.service.getBackendPage(that.stateMachine.page, that.fields, that.stateMachine.documentFilter, mohican.openfiltersToBackendUrlParam(that.stateMachine.openfilters)).then(function(items) {
              that.items = items;
              if(that.startLoadingMessage) {
                that.startLoadingMessage.dismiss();
                that.startLoadingMessage = undefined;
                if(angular.isDefined(that.mnRouter.$stateParams.column) ||
                      angular.isDefined(that.mnRouter.$stateParams.qf) ||
                      angular.isDefined(that.mnRouter.$stateParams.filters)) {
                  if(that.mnRouter.currentRouteName() === that.routeName) {
                    var notif = that.mnNotify.warning({
                      message: 'Data arriving, filtering postponed',
                      details: 'Click \'filter\ to apply filter and sorting to the arrived data, or \'clear\' to show all data',
                      actions: ['filter', 'clear'],

                      dismissable: false
                    });
                    that.eagerLoadingMessage = notif.message;
                    notif.promise.then(function(action) {
                      if(action === 'filter') {
                        console.log('filter');
                        that.service.getCurrentBufferSnapshot();
                      }
                      if(action === 'clear') {
                        console.log('clear');
                        that.clearClientSortAndFilter();
                      }
                    });
                  }
                }
                else {
                  if(that.mnRouter.currentRouteName() === that.routeName) {
                    var notif = that.mnNotify.info({
                      message: 'Data arriving...',
                      details: 'You will be able to see all data after eager loading finish',

                      dismissable: false
                    });
                    that.eagerLoadingMessage = notif.message;
                  }
                }
              }
              // We want to be careful to call waitFullyLoaded only when the
              // initial promise has returned! Now we are sure the eager loading
              // is ongoing.
              that.service.waitFullyLoaded().then(function(resolveMessage) {
                console.log('waitFullyLoaded()', resolveMessage);
                console.log(alreadyLoadedData);
                if(!that.moreDataLoadedMessage) {
                  that.mnNotify.success({
                    message: 'Eager data has been loaded',
                    delay:   -1
                  });
                  if(that.service.backendTotalCount !== that.service.totalCount) {
                    that.mnNotify.warning({
                      message: 'Eager data has been partialy loaded',
                      details: that.service.totalCount + ' of ' + that.service.backendTotalCount + ' documents loaded.'
                    });
                  }
                }
                else {
                  that.moreDataLoadedMessage.dismiss();
                  var notif = that.mnNotify.warning({
                    message: 'Loading is compelted',
                    details: 'Loading is compelted but not all the data is merged. Click \'apply\' to merge them in.',
                    actions: ['apply'],

                    dismissable: false
                  });
                  that.moreDataLoadedMessage = notif.message;
                  notif.promise.then(function(action) {
                    if(action === 'apply') {
                      that.moreDataLoadedMessage = undefined;
                      that.service.refreshCurrentBufferSnapshot();
                      that.loadQuickFiltersAndSort(true);
                    }
                  });
                }
                that.loadQuickFiltersAndSort();
              }, function(error) {
                console.log(error);
              }, function(notification) {
                if(!that.moreDataLoadedMessage && !that.eagerLoadingMessage) {
                  var notif = that.mnNotify.warning({
                    message: 'More data has arrived',
                    details: 'More data has arrived, click \'apply\' to load new arrived data to current filter.',
                    actions: ['apply'],

                    dismissable: false
                  });
                  that.moreDataLoadedMessage = notif.message;
                  notif.promise.then(function(action) {
                    if(action === 'apply') {
                      that.moreDataLoadedMessage = undefined;
                      that.service.refreshCurrentBufferSnapshot();
                      that.loadQuickFiltersAndSort(true);
                    }
                  });
                }
              });
              that.service.waitSnapshotLoaded().then(function() {
                // that.loadQuickFiltersAndSort();
                // console.log('snapshot loaded');
              }, function(error) {
                console.log(error);
              }, function() {
                that.loadQuickFiltersAndSort(true);
              });
            }, function(error) {
              console.log(error);
            });
          }
        });
      },

      loadQuickFiltersAndSort: function(resetPage) {
        var that = this;
        that.fullyLoaded = true;
        if(that.eagerLoadingMessage) {
          that.eagerLoadingMessage.dismiss();
          that.eagerLoadingMessage = undefined;
        }
        if(that.stateMachine.column || that.stateMachine.quickFilterShown) {
          if(resetPage) {
            that.stateMachine.page = 1;
          }
          else {
            that.stateMachine.page = parseInt(angular.isUndefined(that.mnRouter.$state.params.page) ? 1 : parseInt(that.mnRouter.$state.params.page));
          }
          that.mnRouter.transitionTo(that.mnRouter.currentRouteName(),
                         that.stateMachine.stateMachineToUrl(that.fields),
                         { notify: false })
                       .then(function() {
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
          });
        }
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
            }, function() {
              that.mnRouter.pageNotFound();
            });
          }
          else {
            var notif = that.mnNotify.info({
              message: 'Loading ' + that.resourceName + '...',
              details: 'Loading ' + that.resourceName + '...',

              dismissable: false
            });
            that.startLoadingMessage = notif.message;

            mohican.validateLayoutParameter(that.stateMachine.layout, that.layouts, that.mnRouter);
            that.service.getBackendFilters().then(function(documentFilters) {
              documentFilters.forEach(function(documentFilter) {
                that.documentFilters.push({
                  name:     documentFilter.name,
                  show:     'Filter: ' + documentFilter.name,
                  selected: documentFilter.name === that.stateMachine.documentFilter
                });
              });
              mohican.validateBackendFilterParameter(that.stateMachine.documentFilter, that.documentFilters, that.mnRouter);
            });
            that.stateMachine.filters = mohican.urlParamToJson(that.mnRouter.$stateParams.filters, that.fields);

            that.fullyLoaded = false;

            that.loadMnGridItems();
          }
        });
      },

      pageChanged: function(page) {
        var that = this;
        if(!this.fullyLoaded) {
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

      getBackendFilter: function(documentFilter, openfilters) {
        var deffered = this.$q.defer();

        var newRouteParams = _.clone(this.mnRouter.$stateParams);
        newRouteParams.page = undefined;
        // newRouteParams.layout = undefined;
        newRouteParams.column = undefined;
        newRouteParams.direction = undefined;
        newRouteParams.quickFilterShown = false;
        newRouteParams.filters = undefined;
        newRouteParams.documentfilter = documentFilter;
        newRouteParams.openfilters = mohican.openfiltersToUrlParam(openfilters);
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
        var basicDrv = {};
        mohican.extendBasicDriver(basicDrv, $injector, collectionName, fields);
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
