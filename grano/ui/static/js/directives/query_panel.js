grano.directive('gnQueryPanel', ['queryUtils', function(queryUtils) {
  return {
    restrict: 'EA',
    scope: {
      'project': '='
    },
    templateUrl: 'directives/query_panel.html',
    link: function(scope, element, attrs) {
      scope.layers = [];

      scope.$on('queryUpdate', function(e, name, query) {
        if (name == 'root') {
          scope.layers = queryUtils.unpack(query, 0);
        }
      });

      scope.addLayers = function() {
        var lastObject = scope.layers[scope.layers.length-1];
        if (lastObject.obj == 'entity') {
          scope.layers.push({'obj': 'relation', 'as_list': true,
                  'fields': {'schema': null, 'reverse': null, 'properties': {}},
                  'filters': {'properties': {}}});
        }
        scope.layers.push({'obj': 'entity',
                'fields': {'schema': null, 'degree': null, 'properties': {'name': null}},
                'filters': {'properties': {}}});
        scope.update();
      };

      scope.removeLayer = function(layer) {
        scope.layers = scope.layers.slice(0, scope.layers.indexOf(layer));
        scope.update();
      };

      scope.update = function() {
        var query = queryUtils.pack(scope.layers);
        scope.$emit('querySet', 'root', query);
      }
    }
  };
}]);
