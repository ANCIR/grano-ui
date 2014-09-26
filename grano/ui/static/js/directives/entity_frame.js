grano.directive('gnEntityFrame', ['$timeout', '$modal', function ($timeout, $modal) {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            'entity': '=',
            'project': '=',
            'section': '@'
        },
        templateUrl: 'directives/entity_frame.html',
        link: function (scope, element, attrs, model) {

            scope.deleteEntity = function() {
                var d = $modal.open({
                    templateUrl: 'entities/delete.html',
                    controller: 'EntitiesDeleteCtrl',
                    resolve: {
                        entity: function () { return scope.entity; }
                    }
                });
            };

            scope.mergeEntity = function() {
                var d = $modal.open({
                    templateUrl: 'entities/merge.html',
                    controller: 'EntitiesMergeCtrl',
                    resolve: {
                        orig: function () { return scope.entity; }
                    }
                });
            };
        }
    };
}]);
