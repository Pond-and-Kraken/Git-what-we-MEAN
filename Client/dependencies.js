angular.module('gitDepends.dependencies', [])

  .controller('DependenciesController', ['$scope', '$filter', 'Dependencies', function($scope, $filter, Dependencies) {

    $scope.data = [];
    $scope.search = '';
    $scope.getDependencies = function() {
      // Use Dependencies factory to get array of Dependeny objects from database
      // set $scope.dependencies to the array
      // in html file, use ng-repeat to iterate over array, display dependency name and length of repo array

     Dependencies.getDependencies().then(function(data) {
        $scope.dependencies = data;
      }).catch(function(error) {
        console.error(error);
      })
    };
    $scope.getDependencies();
  }])
  .factory('Dependencies', function($http) {
    var getDependencies = function() {
      console.log("Get Request Made");
      return $http({
        method: 'GET',
        url: '/dependencies'
      }).then(function(res) {
        return res.data;
      });
    };
    return {
      getDependencies: getDependencies
    };
  });
