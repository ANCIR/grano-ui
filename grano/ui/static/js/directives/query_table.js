grano.directive('gnQueryTable', ['core', '$http', '$sce', 'queryState', 'metadata',
    function (core, $http, $sce, queryState, metadata) {
    return {
      restrict: 'E',
      scope: {
      },
      templateUrl: 'directives/query_table.html',
      link: function (scope, element, attrs, model) {

        var schemata = [];
        metadata.getSchemata(function(ss) {
          schemata = ss;
        });

        scope.rows = [];
        scope.fields = [];

        scope.getFieldAttribute = function(field, type) {
          var attribute = {'label': field.name};
          field.type = field.type || type;
          angular.forEach(schemata, function(s) {
            if (s.obj == field.type && s.name == field.schema) {
              angular.forEach(s.attributes, function(a) {
                if (a.name == field.name) attribute = a;
              });
            }
          });
          return attribute;
        };

        scope.removeColumn = function(field) {
          var obj = queryState.by_id(field.id);
          angular.forEach(obj.fields.properties, function(p, i) {
            if (p.name == field.name)
              obj.fields.properties.splice(i, 1);
          });
          queryState.sync();
        };

        scope.$on('queryUpdate', function(event, data) {
          scope.fields = queryState.fields();
          var rows = [];
          angular.forEach(data, function(row) {
            var cells = [];
            angular.forEach(scope.fields, function(field) {
              var obj = field.get(row),
                  prop = obj.properties[field.name] || {};
              cells.push({
                'name': field.name,
                'type': field.type,
                'id': obj.id,
                'schema': field.schame,
                'value': prop['value']
              });
            });
            rows.push(cells);
          });
          scope.rows = rows;
        });
      }
    };
}]);
