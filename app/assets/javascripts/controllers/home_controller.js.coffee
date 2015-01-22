@id5_module.controller 'HomeController', [
  '$scope', ($scope) ->
    $scope.criteria =
      criteria_text: null
    $scope.handle_search_criteria_change = ->
      console.log "Text change, now it is #{$scope.criteria.criteria_text}"
    $scope.handle_search_button_click = ->
      console.log "Search button clicked"
    $scope.isCollapsed = true;
    $scope.alerts = [
      { type: 'danger', msg: 'Oh snap! Change a few things up and try submitting again.' },
      { type: 'success', msg: 'Well done! You successfully read this important alert message.' }
    ]
    $scope.addAlert = ->
      $scope.alerts.push({msg: 'Another alert!'});
    $scope.closeAlert = (index) ->
      $scope.alerts.splice(index, 1);
]