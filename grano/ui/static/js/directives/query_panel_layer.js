grano.directive('gnQueryPanelLayer', ['metadata', function(metadata) {
  return {
    restrict: 'EA',
    scope: {
    'project': '=',
    'layer': '='
    },
    templateUrl: 'directives/query_panel_layer.html',
    link: function(scope, element, attrs) {
      scope.schemata = [];
      scope.attributes = [];
      scope.visibleSchemata = [];

      scope.setSchema = function(e) {
        scope.layer.filters.schema = e.name;
      };

      scope.removeLayer = function() {
        alert("TODO");
      };

      scope.getSchemaLabel = function() {
        var label = scope.anyLabel();
        angular.forEach(scope.schemata, function(s) {
          if (scope.object.filters['schema'] == s.name) {
            label = s.meta.plural_upper || s.label;
          }
        });
        return label;
      };

      scope.anyLabel = function() {
        if (scope.layer.obj == 'relation') return 'Any relation type';
        return 'Any entities';
      };

      scope.actionLabel = function() {
        if (scope.layer.root) return 'Find';
        if (scope.layer.obj == 'relation') return 'connected via';
        return 'to';
      };

      scope.availableFields = function () {
        var attributes = [];
        angular.forEach(scope.attributes, function(a) {
          if (a.hidden) return;
          var taken = false;
          angular.forEach(scope.object.fields.properties, function(p) {
            if (p.name == a.name && p.schema == a.schema.name) taken = true;
          });
          if (!taken) attributes.push(a);
        });
        return attributes;
      };

      scope.availableFilters = function () {
        var attributes = [];
        angular.forEach(scope.attributes, function(a) {
          if (a.hidden) return;
          var taken = false;
          angular.forEach(scope.layer.filters.properties, function(p) {
            if (p.name == a.name && p.schema == a.schema.name) taken = true;
          });
          if (!taken) attributes.push(a);
        });
        return attributes;
      };

      scope.addField = function(attr) {
        scope.layer.fields.properties[attr.name] = null;
      };

      scope.addFilter = function(attr) {
        scope.layer.filters.properties[attr.name] = '';
      };

      scope.$watch('layer', function(layer) {
        if (!layer) return;

        metadata.getSchemata().then(function(s) {

          var visible = [{'name': null, 'label': scope.anyLabel()}],
              attributes = [];

          angular.forEach(s, function(sc) {
            if (sc.obj != layer.obj) {
              return;
            }
            
            if (!sc.hidden) visible.push(sc);
            if ((layer.filters && sc.name == layer.filters.schema) || sc.default) {
              angular.forEach(sc.attributes, function(a) {
                var at = angular.copy(a);
                at['schema'] = sc;
                attributes.push(at);
              });
            }
          });

          scope.visibleSchemata = visible;
          scope.schemata = s;
          scope.attributes = attributes;
        });

      });
    }
  };
}]);
