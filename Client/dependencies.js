angular.module('gitWhatWeMean.dependencies', [])

  .controller('DependenciesController', ['$scope', '$filter', 'Dependencies', function($scope, $filter, Dependencies) {

    $scope.data = [];
    $scope.search = '';
    console.log("In the controller");
    //var orderBy = $filter('orderBy');
    $scope.getDependencies = function() {
      // Use Dependencies factory to get array of Dependeny objects from database
      // set $scope.dependencies to the array
      // in html file, use ng-repeat to iterate over array, display dependency name and length of repo array

     Dependencies.getDependencies().then(function(data) {
        console.log("DATA ", data);
        $scope.data = data;
        //$scope.order('-visits',false);
      }).catch(function(error) {
        console.error(error);
      })
    };
    $scope.getDependencies();
    // $scope.order = function(predicate, reverse) {
    //   $scope.data.links = orderBy($scope.data.links, predicate, reverse);
    // };
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
