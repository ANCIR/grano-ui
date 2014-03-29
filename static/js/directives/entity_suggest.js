grano.directive('gnEntitySuggest', ['core', '$http', '$sce', '$q', 'core', function (core, $http, $sce, $q, core) {
    return {
        restrict: 'E',
        scope: {
            'entity': '='
        },
        templateUrl: 'directives/entity_suggest.html',
        link: function (scope, element, attrs, model) {
            var url = core.call('/entities/_suggest');

            scope.loadEntities = function(query) {
                var dfd = $q.defer();
                $http.get(url, {params: {q: query}}).then(function(es) {
                    dfd.resolve(es.data.results);
                });
                return dfd.promise;
            }
        }
    };
}]);
