grano.directive('gnGraph', [function() {
    return {
      restrict: 'EA',
      scope: {
        'results': '='
      },
      link: function(scope, element, attrs) {
        // TODO: work d3 into angular?
        var nodeList = [], linkList = [];
        var color = d3.scale.category20b();
        var vis = d3.select(element[0]).append("svg");
        var w = $(element[0]).width(), h = $(element[0]).height(), r = 10;

        var force = d3.layout.force()
            .charge(-10)
            .linkDistance(30)
            .size([w, h]);


        function update() {
            var max_r = 20;
            //var getRadius = function(d) {
            //  return d.isRoot ? 15 : Math.max(5, Math.min(max_r, Math.sqrt(d.weight * 4)));
            //};

            var getRadius = function(d) {
                return 5;
            }

            var goodPos = [[w / 4, h / 3], [w * 3 / 4, h / 3]];

            force
                .gravity(0)
                .nodes(nodeList)
                .links(linkList)
                .start();

            /*
            nodeList = nodeList.filter(node_filter).map(function(d){
              var r = getRadius(d);
              if (r === max_r) {
                d.fixed = true;
                var pos = goodPos.pop();
                if (pos) {
                  d.x = d.px = pos[0];
                  d.y = d.py = pos[1];
                }
              }
              return d;
            });
            */

            // Update the links…
            link = vis.selectAll('line.link')
                .data(linkList
                   //.filter(link_filter_normal)
                );

            // Enter any new links.
            link.enter().insert('svg:line', '.node')
                .attr('class', 'link')
                //.attr('title', function(d){ return d.source + ' - ' + d.target; })
                .style('stroke', function(d) { return color(d.schema); });


            // Exit any old links.
            link.exit().remove();

            // Update the nodes…
            node = vis.selectAll('circle.node').data(nodeList);

            var drag = force.drag();
              //.on('dragstart', dragstart);

            node.
              enter().append('svg:circle')
                .classed('node', true)
                //.classed('root', function(d){ return !!d.isRoot; })
                //.classed('related', function(d){ return !d.isRoot; })
                // .classed('entity', function(d){ return !!d.isEntity; })
                // .attr('cx', function(d) { return d.x; })
                // .attr('cy', function(d) { return d.y; })
                .attr('r', getRadius)
                .attr('title', function(d){ return d.name; })
                // .style('fill', function(d){ return color(d.schema); })
                //.on('click', click)
                .on('mouseover', function(d){
                  var sel = d3.select(this);
                  //sel.moveToFront();
                  //var offset = $(selector).offset();
                  //var x = d.x + offset.left + 20;
                  //var y = d.y + offset.top  - 10;

                  //$(options.titleSelector)
                  //  .text(d.name)
                  //  .show()
                  //  .css({'left': x + 'px', 'top': y + 'px'});
                })
                .on('mouseout', function(){
                  //$(options.titleSelector).hide();
                })
                .attr('cx', function(d) { return d.x; })
                .attr('cy', function(d) { return d.y; })
                //.on('dblclick', dblclick)
                .call(drag);


            // Exit any old nodes.
            node.exit().remove();
        }


        force.on('tick', function() {
            link.attr('x1', function(d) { return d.source.x; })
                .attr('y1', function(d) { return d.source.y; })
                .attr('x2', function(d) { return d.target.x; })
                .attr('y2', function(d) { return d.target.y; });

            node.attr('cx', function(d) {
              d.x = Math.max(r, Math.min(w - r, d.x));
              return d.x;
            })
            .attr('cy', function(d) {
              d.y = Math.max(r, Math.min(h - r, d.y));
              return d.y;
            });
        });


        scope.$watch('results', function(r) {
            if (angular.isUndefined(r)) {
                return;
            }

            var nodes = {}, links = {};

            var getNodes = function(obj) {
                if (obj === null || angular.isUndefined(obj)) {
                    return;
                }
                if (angular.isArray(obj)) {
                    return angular.forEach(obj, function(o) { getNodes(o); });
                }

                angular.forEach(['inbound', 'outbound', 'relations'], function(key) {
                    getLinks(obj[key], obj.id);
                });

                var schemata = [];
                angular.forEach(obj.schemata, function(s) { schemata.push(s.name); });
                nodes[obj.id] = {'id': obj.id,
                                 'isRoot': false,
                                 'schemata': schemata,
                                 'name': obj.properties.name.value};
            };

            var getLinks = function(obj, parent) {
                if (obj === null || angular.isUndefined(obj)) {
                    return;
                }
                if (angular.isArray(obj)) {
                    return angular.forEach(obj, function(o) { getLinks(o, parent); });
                }

                var child_id = null;
                angular.forEach(['source', 'target', 'other'], function(key) {
                    getNodes(obj[key]);
                    if (!angular.isUndefined(obj[key])) {
                        child_id = obj[key].id;
                    }
                });

                links[obj.id] = {
                                'id': obj.id,
                                'schema': obj.schema.name,
                                'source': obj.reverse ? child_id : parent,
                                'target': obj.reverse ? parent : child_id
                                };
            };
            
            getNodes(r.results);

            for (var nodeId in nodes) {
                nodeList.push(nodes[nodeId]);
                nodes[nodeId].index = nodeList.length - 1;
            }
            
            var addLink = function(nodeid) {
                return function(l){
                    linkList.push({
                        source: nodes[nodeid].index,
                        target: nodes[l.target].index,
                        schema: l.schema,
                        isRelated: l.isRelated
                    });
                };
            };

            for (var linkId in links) {
                link = links[linkId];
                linkList.push({
                    source: nodes[link.source].index,
                    target: nodes[link.target].index,
                    schema: link.schema,
                    id: link.id
                });
            }

            update();
            
        });

    }};
}]);


function GraphBrowserCtrl($scope, $routeParams, $location, $http, $modal,
        $timeout, core, session, schemata) {
    $scope.loadProject($routeParams.slug);


    var query = [{
                    'properties': {'name': null},
                    'schemata': [{'name': null}],
                    'relations': [{
                        'reverse': null,
                        'schema': {'name': null},
                        'other': {
                            'schemata': [{'name': null}],
                            'properties': {'name': null}
                        }
                    }]
                }];

    console.log(JSON.stringify(query));
    query = {'query': JSON.stringify(query)};
    var res = $http.get(core.call('/projects/' + $routeParams.slug + '/query'), {'params': query});
    res.then(function(r) {
        //console.log(r.data);
        $scope.results = r.data;
    });
}

GraphBrowserCtrl.$inject = ['$scope', '$routeParams', '$location', '$http', '$modal',
    '$timeout', 'core', 'session', 'schemata'];
