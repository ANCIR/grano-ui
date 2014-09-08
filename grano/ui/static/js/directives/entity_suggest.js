grano.directive('gnEntitySuggest', ['core', '$http', '$sce', '$q', 'core', function (core, $http, $sce, $q, core) {
    return {
        restrict: 'E',
        scope: {
            'entity': '=', 
            'project': '=',
            'exclude': '='
        },
        templateUrl: 'directives/entity_suggest.html',
        link: function (scope, element, attrs, model) {
            var url = core.call('/entities/_suggest');

            scope.loadEntities = function(query) {
                var dfd = $q.defer(),
                    params =  {
                        q: query,
                        project: scope.project.slug
                    };
                if (scope.exclude) {
                    params.exclude = scope.exclude.id;
                }
                $http.get(url, {params: params}).then(function(es) {
                    dfd.resolve(es.data.results);
                });
                return dfd.promise;
            }
        }
    };
}]);
