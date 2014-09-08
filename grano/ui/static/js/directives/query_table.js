
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
