grano.factory('queryUtils', [function() {
    
    var nextLevel = function(obj) {
      var keys = ['relations', 'other'];
      if (obj != null) {
        for (var i in keys) {
          var v = obj[keys[i]]
          if (!angular.isUndefined(v)) {
            if (!angular.isArray(v) || v.length > 0) {
              return keys[i];  
            }
          }
        }  
      }
      return null;
    };

    return {
        nextLevel: nextLevel
    };
}]);
