angular.module('gitDepends', [
  'gitDepends.dependencies',
  'ngRoute',
  'ui.router',
])
.config(function($routeProvider, $httpProvider, $stateProvider, $urlRouterProvider) {
  // currently all routes are routed to /dependencies
  // dependencies.html is rendered on the dom and DependenciesController (in dependencies.js) is called
  $urlRouterProvider.otherwise('/dependencies'); 
    $stateProvider
    .state('dependencies', {
      templateUrl: '/dependencies.html',
      controller: 'DependenciesController',
      url:'/dependencies'
    })
})
