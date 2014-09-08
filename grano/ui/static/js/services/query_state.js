grano.factory('queryState', function($http, $rootScope, $location, core, metadata){

  var objects = [{'id': 'root', 'type': 'entity',
                  'fields': {'properties': [{'name': 'name', 'schema': 'base'}]},
                  'filters': {'properties': []}}],
      previous = null;

  var init = function() {
      var qs = $location.search();
      if (angular.isDefined(qs['o'])) {
        // can't simply assign because we can't replace 'objects'
        objects.splice(0);
        angular.forEach(angular.fromJson(qs['o']), function(e) {
          objects.push(e);
        });
      }
      sync();
  };

  var sync = function() {
    if (!angular.equals(objects, previous)) {
      $location.search('o', angular.toJson(objects));
      update();
    }
    previous = angular.copy(objects);
  };

  var update = function() {
    project = metadata.getProject()
    if (!project) return;
    var q = makeQuery();
    q['limit'] = 15;
    $rootScope.$broadcast('querySend');
    var params = {'query': angular.toJson([q])};
    var res = $http.get(core.call('/projects/' + project.slug + '/query'), {'params': params});
    res.then(function(rd) {
      $rootScope.$broadcast('queryUpdate', rd.data.results);
    });
  };

  var by_id = function(id) {
    var obj = null;
    angular.forEach(objects, function(o) {
      if (o.id == id) obj = o;
    });
    return obj;
  };

  var makeQuery = function() {
    var root = by_id('root');
    var transformObj = function (obj) {
      var q = {'id': null, 'properties': {}};

      // define fields
      angular.forEach(obj.fields['properties'], function(o) {
        q['properties'][o.name] = null;
      });

      // define filters
      angular.forEach(obj.filters['properties'], function(o) {
        q['properties'][o.name] = {'value': o.value};
      });

      if (obj.filters['schema']) {
        var key = obj.type == 'entity' ? 'schemata' : 'schema';
        q[key] = obj.filters['schema'];
      }

      angular.forEach(objects, function(c) {
        if (c['parent'] !== obj.id) return;
        var key = obj.type == 'entity' ? 'relations' : 'other';
        q[key] = transformObj(c);
      });
      return q;
    };
    return transformObj(root);
  };

  var add = function(object) {
    object['id'] = makeId();
    object['parent'] = objects[objects.length-1].id;
    objects.push(object);
  };

  var fields = function() {
    var fields = [];
    angular.forEach(objects, function(object) {
      angular.forEach(object.fields.properties, function(p) {
        var field = angular.copy(p);
        field['type'] = object.type;
        field['id'] = object.id;
        field['get'] = makeGetter(object);
        fields.push(field);
      });
    });
    return fields;
  };

  var makeGetter = function(obj) {
    return function(data) {
      if (!obj['parent']) {
        return data;
      };
      var parent = null;
      angular.forEach(objects, function(o) {
        if (o.id == obj.parent) parent = o;
      });
      var parent_data = makeGetter(parent)(data),
          parent_key = parent.type == 'entity' ? 'relations' : 'other';
      data = parent_data[parent_key];
      // TODO: handle multi-row results
      if (angular.isArray(data)) data = data[0];
      return data;
    };
  };

  return {
    'objects': objects,
    'init': init,
    'add': add,
    'sync': sync,
    'update': update,
    'by_id': by_id,
    'fields': fields
  };
});
