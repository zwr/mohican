(function(mohican) {
  'use strict';

  mohican.createBaseDriver = function() {
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

      popDialog: function(title, templateUrl, ctrl) {
        var modalInstance = this.modal.open({
          animation: true,
          template: '<div class="modal-header">                                   \
            <h3 class="modal-title">{{mnDialogActiveTitle}}</h3>                  \
          </div>                                                                  \
          <div class="modal-body">                                                \
            <p>I am the dialog</p>                                                \
            <ng-include src="mnDialogActiveTemplate"></ng-include>                \
          </div>                                                                  \
          <div class="modal-footer">                                              \
            <button class="btn btn-primary" ng-click="ok()">OK</button>           \
            <button class="btn btn-warning" ng-click="cancel()">Cancel</button>   \
          </div>',
          //templateUrl: mohican/directives/mn-dialog-sorcerer/template2.html',
          controller: ['$scope', '$modalInstance', function($scope, $modalInstance) {
            $scope.ok = function(result) {
              $modalInstance.close(result);
            };
            $scope.cancel = function(reason) {
              $modalInstance.dismiss(reason);
            };
            $scope.mnDialogActiveTitle = title;
            $scope.mnDialogActiveTemplate = templateUrl;
            $scope.ctrl = ctrl;
          }],
          size: 'lg'
        });

        modalInstance.result.then(function () {
          console.log('Modal success at: ' + new Date());
        }, function () {
          console.log('Modal dismissed at: ' + new Date());
        });
        
        return modalInstance.result;
      },
      closeDialog: function() {
        this.mnDialogVisible = false;
      }
    };
  };
}(window.mohican));
