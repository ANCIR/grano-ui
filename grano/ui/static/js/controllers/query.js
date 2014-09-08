
grano.controller('ResultTableCtrl', function ($scope, queryState) {
  $scope.rows = [];
  $scope.fields = [];

  $scope.removeColumn = function(field) {
    var obj = queryState.by_id(field.id);
    angular.forEach(obj.fields.properties, function(p, i) {
      if (p.name == field.name)
        obj.fields.properties.splice(i, 1);
    });
    queryState.sync();
  };

  $scope.$on('queryUpdate', function(event, data) {
    $scope.fields = queryState.fields();
    var rows = [];
    angular.forEach(data, function(row) {
      var cells = [];
      angular.forEach($scope.fields, function(field) {
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
    $scope.rows = rows;
  });

});


grano.controller('QueryObjectCtrl', function ($scope, queryState, metadata) {
  $scope.schemata = [];
  $scope.attributes = [];
  $scope.visibleSchemata = [];


  $scope.setSchema = function(e) {
    $scope.object.filters['schema'] = e.name;
  };

  $scope.removeLayer = function() {
    var idx = queryState.objects.indexOf($scope.object);
    queryState.objects.splice(idx);
  };

  $scope.getSchemaLabel = function() {
    var label = $scope.anyLabel();
    angular.forEach($scope.schemata, function(s) {
      if ($scope.object.filters['schema'] == s.name) {
        label = s.meta.plural_upper || s.label;
      }
    });
    return label;
  };

  $scope.anyLabel = function() {
    if ($scope.object.type == 'relation') return 'Any relation type';
    return 'Any entities';
  };

  $scope.actionLabel = function() {
    if ($scope.object.id == 'root') return 'Find';
    if ($scope.object.type == 'relation') return 'connected via';
    return 'to';
  };

  $scope.availableFields = function () {
    var attributes = [];
    angular.forEach($scope.attributes, function(a) {
      if (a.hidden) return;
      var taken = false;
      angular.forEach($scope.object.fields.properties, function(p) {
        if (p.name == a.name && p.schema == a.schema.name) taken = true;
      });
      if (!taken) attributes.push(a);
    });
    return attributes;
  };

  $scope.availableFilters = function () {
    var attributes = [];
    angular.forEach($scope.attributes, function(a) {
      if (a.hidden) return;
      var taken = false;
      angular.forEach($scope.object.filters.properties, function(p) {
        if (p.name == a.name && p.schema == a.schema.name) taken = true;
      });
      if (!taken) attributes.push(a);
    });
    return attributes;
  };

  $scope.addField = function(attr) {
    $scope.object.fields.properties.push({
      'name': attr.name,
      'schema': attr.schema.name
    });
  };

  $scope.addFilter = function(attr) {
    $scope.object.filters.properties.push({
      'name': attr.name,
      'schema': attr.schema.name,
      'value': ''
    });
  };

  $scope.$watch('object', function(obj) {
    if (!obj) return;

    metadata.getSchemata().then(function(s) {

      var visible = [{'name': null, 'label': $scope.anyLabel()}],
          attributes = [];

      angular.forEach(s, function(sc) {
        if (sc.obj != obj.type) {
          return;
        }
        
        if (!sc.hidden) visible.push(sc);
        if (sc.name == obj.filters['schema'] || obj.default) {
          angular.forEach(sc.attributes, function(a) {
            var at = angular.copy(a);
            at['schema'] = sc;
            attributes.push(at);
          });
        }
      });

      $scope.visibleSchemata = visible;
      $scope.schemata = s;
      $scope.attributes = attributes;
    });

  });

  $scope.$watch('object', function(o) {
    queryState.sync();
  }, true);

});


function QueryCtrl($scope, $routeParams, $http, $q, metadata, queryState) {
  $scope.loadProject($routeParams.slug);

  var allSchemata = [];
  metadata.getSchemata(function(schemata) {
    allSchemata = schemata;
  });

  $scope.loading = false;
  $scope.objects = queryState.objects;

  $scope.$on('querySend', function() {
    $scope.loading = true;
  });

  $scope.$on('queryUpdate', function(event, result) {
    $scope.loading = false;
  });

  $scope.getFieldAttribute = function(field, type) {
    var attribute = {'label': field.name};
    field.type = field.type || type;
    angular.forEach(allSchemata, function(s) {
      if (s.obj == field.type && s.name == field.schema) {
        angular.forEach(s.attributes, function(a) {
          if (a.name == field.name) attribute = a;
        });
      }
    });
    return attribute;
  };

  $scope.addLayers = function() {
    var lastObject = queryState.objects[queryState.objects.length-1];
    if (lastObject.type == 'entity') {
      queryState.add({'type': 'relation',
                      'fields': {'properties': []},
                      'filters': {'properties': []}});
    }
    queryState.add({'type': 'entity',
                    'fields': {'properties': [{'schema': 'base', 'name': 'name'}]},
                    'filters': {'properties': []}});
    queryState.sync();
  };

  
  queryState.init();
  queryState.sync();
};

QueryCtrl.$inject = ['$scope', '$routeParams', '$http', '$q', 'metadata', 'queryState'];
