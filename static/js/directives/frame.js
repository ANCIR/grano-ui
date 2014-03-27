
grano.directive('gnFrame', ['$location', 'schemata', function($location, schemata) {
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
                if (!angular.isUndefined(scope.updateSearch)) {
                    $location.search('schema', schema);
                    scope.updateSearch();
                } else {
                    $location.path('/p/' + slug + '/entities');
                    if (schema) {
                        $location.search('schema', schema);
                    }
                }
            };
        }
    }
}]);
