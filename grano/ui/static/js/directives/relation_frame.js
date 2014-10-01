grano.directive('gnRelationFrame', ['$timeout', '$location', '$modal', function ($timeout, $location, $modal) {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            'relation': '=',
            'project': '=',
            'section': '@'
        },
        templateUrl: 'directives/relation_frame.html',
        link: function (scope, element, attrs, model) {

            scope.deleteRelation = function() {
                var after = '/p/' + scope.relation.project.slug + '/entities/' + scope.relation.source.id;
                var d = $modal.open({
                    templateUrl: 'relations/delete.html',
                    controller: 'RelationsDeleteCtrl',
                    resolve: {
                        relation: function () { return scope.relation; }
                    }
                });
                d.result.then(function(result) {
                    if (result == 'ok') {
                        $location.path(after);
                    } 
                });
            };
        }
    };
}]);
