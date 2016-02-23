var todo = angular.module('todoApp', ['ngMaterial'])
.controller('AppCtrl', function ($scope, $log,  $http) {
    var tabs = [
      { title: 'Active'},
      { title: 'Completed'},
      { title: 'All'},
   ];
    $scope.tabs = tabs;
    $scope.selectedIndex = 0;
    $scope.$watch('selectedIndex', function(current, old){
      if ( old && (old != current)) $log.debug('Goodbye ' + tabs[old].title + '!');
      if ( current )                $log.debug('Hello ' + tabs[current].title + '!');
        $http.get('/api/todos', 
            {
                params: { status: tabs[$scope.selectedIndex].title}
            })
            .success(function(data) {
                $scope.todos = data;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    });

    $scope.formData = {};

    // when landing on the page, get all todos and show them
    $http.get('/api/todos', 
        {
            params: { status: tabs[$scope.selectedIndex].title}
        })
        .success(function(data) {
            $scope.todos = data;
            $scope.activeCount = $scope.todos.length;
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    
    // when submitting the add form, send the text to the node API
    $scope.createTodo = function() {
        $http.post('/api/todos', {todo: $scope.formData, status: tabs[$scope.selectedIndex].title})
            .success(function(data) {
                $scope.formData = {}; // clear the form so our user is ready to enter another
                // when landing on the page, get all todos and show them     
                $scope.todos = data;           
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
        $scope.activeCount += 1;
    };

    // complete a todo after checking it
    $scope.toggleTodoCompleted = function(todo) {
        $http.post('/api/toggleTodoCompleted/', {todo: todo, status: tabs[$scope.selectedIndex].title})
            .success(function(data) {
                $scope.todos = data;
                if (todo.completed){
                    $scope.activeCount -= 1;
                } else {
                    $scope.activeCount += 1;
                }
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    $scope.startEditing = function (todo) {
        todo.editing = true;
    }

    $scope.saveEdits = function (todo, blur) {
        $http.post('api/saveEditedTodo/', todo)
            .success(function(data){
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
        todo.editing = false;
    }

    $scope.removeTodo = function (todo){
        $http.post('api/removeTodo/', {todo: todo, status: tabs[$scope.selectedIndex].title})
            .success(function(data){
                $scope.todos = data;
                if(!todo.completed){
                    $scope.activeCount -=1;
                }
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    }

})
.directive('todoFocus', function todoFocus($timeout) {
    'use strict';
    return function (scope, elem, attrs) {
        scope.$watch(attrs.todoFocus, function (newVal) {
            if (newVal) {
                $timeout(function () {
                    elem[0].focus();
                }, 0, false);
            }
        });
    };
})
.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default');
});


