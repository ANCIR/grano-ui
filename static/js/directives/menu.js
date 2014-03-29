grano.directive('gnMenu', ['$timeout', '$location', '$route', 'schemata', 'session',
    function ($timeout, $location, $route, schemata, session) {
    return {
        restrict: 'E',
        scope: {
            project: '=',
            navSection: '=',
            full: '=',
            ulClass: '@'
        },
        templateUrl: 'directives/menu.html',
        link: function (scope, element, attrs, model) {
            scope.schemata = [];

            scope.$watch('project', function(p) {
                scope.schemata = [];
                
                if (!p || !p.slug) return;

                schemata.get(p.slug).then(function(ss) {
                    angular.forEach(ss, function(s) {
                        if (s.obj == 'entity' && !s.hidden) {
                            scope.schemata.push(s);
                        }
                    });
                });
            });

            scope.applyFacet = function(schema) {
                $location.path('/p/' + scope.project.slug + '/entities');
                $location.search({'schema': schema});
                $route.reload();
            };
        }
    };
}]);
