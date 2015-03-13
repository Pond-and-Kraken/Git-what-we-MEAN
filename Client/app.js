angular.module('gitWhatWeMean', [
  'ngRoute',
  'ui.router',
  'gitWhatWeMean.dependencies'
])
.config(function($routeProvider, $httpProvider, $stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');
  $stateProvider
    // .state('index', {
    //   templateUrl: 'Client/index.html',
    //   url:'/'
    // })
    .state('dependencies', {
      templateUrl: '/dependencies.html',
      controller: 'DependenciesController',
      url:'/dependencies'
    })
})
