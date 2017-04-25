app.directive('task', function(){
  return{
    restrict: 'E',
    scope: {
      data: '='
    },
    templateUrl: 'task.html'
  }
});
