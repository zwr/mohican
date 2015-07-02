(function(mohican) {
  'use strict';

  mohican.createBaseController = function() {
    return {
      stateMachine: mohican.createStateMachine(),

      currentItemChanged: function() {},

      initialize: function() {},

      loadData: function() {},

      pageChanged: function() {},

      clientLayoutChanged: function() {},

      getBackendFilter: function() {},

      clientViewChanged: function() {},

      toggleQuickFilter: function() {},

      clearClientSortAndFilter: function() {},

      mnDialogVisible: false,

      popDialog: function(title, templateUrl) {
        this.mnDialogActiveTitle = title;
        this.mnDialogVisible = true;
        this.mnDialogActiveTemplate = templateUrl;

      },

      closeDialog: function() {
        this.mnDialogVisible = false;
      }
    };
  };
}(window.mohican));
