/* 
Source: https://github.com/pudo/kompromatron/blob/master/kompromatron/static/js/granoexplorer.js

Steal here: http://bl.ocks.org/d3noob/5141278

http://marvl.infotech.monash.edu/webcola/

*/

grano.colors = [
    "#BCD631", "#F68B1F", "#CF3D1E", "#00833D", "#F15623", "#FFC60B", "#DFCE21",
    "#95C93D", "#48B85C", "#00B48D", 
    "#60C4B1", "#27C4F4", "#478DCB", "#3E67B1", "#4251A3", "#59449B", 
    "#6E3F7C", "#6A246D", "#8A4873", "#EB0080", "#EF58A0", "#C05A89"
    ];

grano.directive('gnQueryGraph', ['$window', '$timeout', '$compile', '$location',
    function($window, $timeout, $compile, $location) {
    return {
      restrict: 'EA',
      scope: {
        'project': '='
      },
      link: function(scope, element, attrs) {
        // TODO: work d3 into angular properly?
        var nodes = {}, links = {};
        var color = d3.scale.ordinal().range(grano.colors);
        var vis = d3.select(element[0]).append("svg"),
            path_group = vis.append("svg:g"),
            path = null,
            node = null;
        var w = null, h = null, min_r = null, max_r = null;

        var d3cola = cola.d3adaptor();

        angular.element($window).bind('resize', function() {
            update();
        });

        function scaleGraph() {
            w = $(element[0]).width();
            h = w * 0.6;
            $(element[0]).find('svg').height(h);
            max_r = w * (1/30);
            min_r = 0.3 * max_r;

            var dist = max_r * 2;

            d3cola.linkDistance(dist)
                //.symmetricDiffLinkLengths(max_r * 4)
                //.avoidOverlaps(true)
                .size([w, h]);
            /*
            force.stop()
                .linkDistance(dist)
                .chargeDistance(dist * 2)
                .gravity(0.01)
                .charge(-100)
                .size([w, h])
            */
        }

        function updateGraph() {
            var nodeList = [],
                linkList = [],
                nodeIndexes = {};

            for (var query in nodes) {
                for (var nodeId in nodes[query]) {
                    if (angular.isUndefined(nodeIndexes[nodeId])) {
                        nodeList.push(nodes[query][nodeId]);
                        nodeIndexes[nodeId] = nodeList.length - 1;    
                    }
                }    
            }
            
            for (var query in links) {
                for (var linkId in links[query]) {
                    link = links[query][linkId];
                    linkList.push({
                        source: nodeIndexes[link.source],
                        target: nodeIndexes[link.target],
                        schema: link.schema,
                        id: link.id
                    });
                }    
            }

            return {
                'nodes': nodeList,
                'links': linkList
            }
        }

        function radiusScale(nodes) {
            var min_deg = 10000, max_deg = 0;
            for (var i in nodes) {
                var d = nodes[i].degree;
                if (d > max_deg) {
                    max_deg = d;
                }
                if (d < min_deg) {
                    min_deg = d;
                }
            }
            return d3.scale.linear()
                .domain([min_deg, max_deg])
                .rangeRound([min_r, max_r]);
        }

        function update() {
            scaleGraph();

            var graph = updateGraph(),
                scale = radiusScale(graph.nodes);

            var getRadius = function(d) {
              d.radius = scale(d.degree || 0);
              return d.radius;
            };

            var getColor = function(d) {
                return color(d.schema.name);
            };

            d3cola
                .nodes(graph.nodes)
                .links(graph.links)
                .start(10, 15, 20);

            path = path_group.selectAll("path")
                .data(d3cola.links());


            path.enter().append("svg:path")
                    .attr("class", "link");
                    //.attr("marker-end", "url(#end)");

            path.exit().remove();

            vis.selectAll(".node").remove();
            // define the nodes
            node = vis.selectAll(".node")
                    .data(d3cola.nodes())
                .enter().append("g")
                    .attr("class", "node")
                    .on('dragstart', function(d) {
                        d3.event.sourceEvent.stopPropagation();
                    })
                    .on('click', expandNode)
                    .on('dblclick', viewNode)
                    .on('mouseenter', mouseEnter)
                    .on('mouseleave', mouseLeave)
                    .call(d3cola.drag);

            node.append('svg:circle')
                .style('fill', getColor)
                .attr('tooltip-append-to-body', true)
                .attr('tooltip-placement', 'top')
                .attr('tooltip', function(d) { return d.name; })
                .attr('r', getRadius)

            // add the text 
            var cutoff = (max_r - min_r) * 0.5;
            node.filter(function(d) { return d.radius > cutoff; })
                .append("text")
                .attr("x", -12)
                .attr("dy", ".4em")
                .text(function(d) { return d.name.length > 50 ? d.name.slice(0, 50) + '...' : d.name; });

            /* https://stackoverflow.com/questions/24759368/angular-bootstrap-repeatedly-calling-compile-with-bootstrap-tooltip-causes-sl */
            var destroyer = function(scopeElem) {
              if(scopeElem.$$nextSibling) {
                destroyer(scopeElem.$$nextSibling);
              }
              scopeElem.$destroy();
            };

            if(scope.$$childHead) {
              destroyer(scope.$$childHead);
            }

            $compile(vis[0])(scope);
        }

        var mouseEnter = function(d) {
            path.filter(function(p) {
                return p.source.id == d.id || p.target.id == d.id;
            }).style('stroke', '#666');
        };

        var mouseLeave = function(d) {
            path.filter(function(p) {
                return p.source.id == d.id || p.target.id == d.id;
            }).style('stroke', '#ccc');
        };

        var viewNode = function(d) {
            $location.path('/p/' + scope.project.slug + '/entities/' + d.id);
        };

        var expandNode = function(d) {
            if (d3.event.defaultPrevented) return;
            var q_name = 'expand_' + d.id,
                q = {
                    'id': d.id,
                    'schema': null,
                    'degree': null,
                    'properties': {'name': null},
                    'relations': [{
                        'schema': null,
                        'reverse': null,
                        'other': {
                            'id': null,
                            'degree': null,
                            'schema': null,
                            'properties': {'name': null}
                        }
                    }]
                };
            scope.$emit('querySet', q_name, q);
        }

        d3cola.on('tick', function() {
            path.attr("d", function(d) {
                var dx = d.target.x - d.source.x,
                    dy = d.target.y - d.source.y,
                    dr = Math.sqrt(dx * dx + dy * dy);
                return "M" + 
                    d.source.x + "," + 
                    d.source.y + "A" + 
                    dr + "," + dr + " 0 0,1 " + 
                    d.target.x + "," + 
                    d.target.y;
            });

            node
                .attr("transform", function(d) {
                    d.x = Math.max(d.radius, Math.min(w - d.radius, d.x));
                    d.y = Math.max(d.radius, Math.min(h - d.radius, d.y));
                    return "translate(" + d.x + "," + d.y + ")";
                });
        });

        scope.$on('queryMode', function(event, mode) {
            if (mode == 'graph') {
                $timeout(function() { update(); });
            }
        });

        scope.$on('queryResult', function(event, queryName, data) {
            var queryNodes = {},
                queryLinks = {};

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

                queryNodes[obj.id] = {
                    'id': obj.id,
                    'isRoot': false,
                    'schema': obj.schema,
                    'degree': obj.degree,
                    'name': obj.properties.name.value
                };
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

                queryLinks[obj.id] = {
                    'id': obj.id,
                    'schema': obj.schema.name,
                    'source': obj.reverse ? child_id : parent,
                    'target': obj.reverse ? parent : child_id
                };
            };
            
            getNodes(data.results);
            nodes[queryName] = queryNodes;
            links[queryName] = queryLinks;

            update();
        });

    }};
}]);
