/**
 * Created by lenka on 10/14/15.
 */
angular.module('Timeline', [])
    .service('Timeline', [function () {

    }])
    .directive('timeline', ['$rootScope', '$compile', '$timeout', function ($rootScope, $compile, $timeout) {
        return {
            restrict: 'E',
            templateUrl: '/ng-views/components/timeline.html',
            link: function (scope, el, attrs) {
                // Create x2js instance with default config
                var x2js = new X2JS();

                var svg = el.find('svg'),
                    svgEl = svg[0],
                    points = +attrs.points,
                    width = svgEl.clientWidth,
                    stroke = '#797e83',
                    strokeW = 1,
                    fill = 'none',
                    r = 6,
                    x = 7,
                    y = 10,
                    lw = (width - points * r * 2) / (points - 1) | 0,
                    circles = [],
                    lines = [];

                for (var i = 0; i < points; i++) {
                    var cx = x + (lw + r * 2) * i,
                        x1 = cx + r,
                        x2 = x1 + lw,
                        circleClass = (i !== 0) ? 'timeline__circle' : 'timeline__circle--active';

                    var circle = {
                            _cx: cx,
                            _cy: y,
                            _r: r,
                            _stroke: stroke,
                            '_stroke-width': strokeW,
                            _fill: fill,
                            _class: circleClass,
                            _index: i
                        },
                        line = {
                            _x1: x1,
                            _y1: y,
                            _x2: x2,
                            _y2: y,
                            _stroke: stroke,
                            '_stroke-width': strokeW
                        };

                    circles.push(circle);
                    if (i < points - 1) {
                        lines.push(line);
                    }
                }

                // JSON to XML string
                var xmlDocStr = x2js.json2xml_str(
                    {
                        circle: circles,
                        line: lines
                    }
                );
                var index = 0;

                function circleClick(el) {
                    svg.find('circle').removeClass('timeline__circle--active').addClass('timeline__circle');
                    el.setAttribute('class', 'timeline__circle--active');
                };
                svg.on('click', function (e) {
                    if (e.target.nodeName == "circle") {
                        index = e.target.getAttribute('index');
                        circleClick(e.target);
                        $timeout(function () {
                            scope.getDayLesson(+index);
                        });
                        $rootScope.$broadcast('circleClick', index);
                    }
                });
                $rootScope.$on('dayClick', function (e, index) {
                    circleClick(svg.find('circle')[index]);
                });
                svg.html(xmlDocStr);
                $compile(angular.element(svg))(scope);
            },
        }
    }]);