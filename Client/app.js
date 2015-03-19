angular.module('gitDepends', [
  'gitDepends.dependencies',
  'ngRoute',
  'ui.router',
])
.config(function($routeProvider, $httpProvider, $stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('/dependencies');
  console.log("In config");
    $stateProvider
  //   //  .state('index', {
  //   //   templateUrl: '/index.html',
  //   //   url:'/'
  //   // })
    .state('dependencies', {
      templateUrl: '/dependencies.html',
      controller: 'DependenciesController',
      url:'/dependencies'
    })
})
