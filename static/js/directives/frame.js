
grano.directive('gnFrame', ['$location', '$route', 'schemata',
    function($location, $route, schemata) {
    return {
        restrict: 'E',
        transclude: true,
        templateUrl: 'directives/frame.html',
        link: function (scope, element, attrs, model) {
            scope.$watch('project', function(e) {
                if (!angular.isUndefined(e) && !angular.isUndefined(e.slug)) {
                    schemata.get(e.slug).then(function(ss) {
                        scope.frameSchemata = [];
                        angular.forEach(ss, function(s) {
                            if (s.obj == 'entity' && !s.hidden) {
                                scope.frameSchemata.push(s);
                            }
                        });
                    });
                }
            });

            scope.frameSearch = function(slug, schema) {
                $location.path('/p/' + slug + '/entities');
                $location.search({'schema': schema});
                if (!angular.isUndefined(scope.updateSearch)) {
                    $route.reload();
                }
            };
        }
    }
}]);
