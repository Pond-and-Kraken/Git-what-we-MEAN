angular.module('gitDepends', [
  'gitDepends.dependencies',
  'gitDepends.repos',
  'ngRoute',
  'ui.router',
])
.config(function($routeProvider, $httpProvider, $stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('/dependencies');
  console.log("In config");
    $stateProvider
    .state('dependencies', {
      templateUrl: '/dependencies.html',
      controller: 'DependenciesController',
      url:'/dependencies'
    })
    .state('repos',{
      templateUrl: '/repos.html',
      controller: 'ReposController',
      url:'/repos'
    })
})
