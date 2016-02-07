angular.module('Clock', [])
    .service('Clock', [function () {
        this.setSvg = function (svg) {
            this.svg = svg;
            var lineMin = svg.getElementById('min'),
                lineH = svg.getElementById('hour');
            this.min = {
                line: lineMin,
                x: lineMin.getAttribute('x2'),
                y: lineMin.getAttribute('y2')
            };
            this.hour = {
                line: lineH,
                x: lineH.getAttribute('x2'),
                y: lineH.getAttribute('y2')
            };
        };
        this.setMin = function (min) {
            this.min.line.setAttribute('transform', 'rotate(' + min * 6 + ' , ' + this.min.x + ' , ' + this.min.y + ')');
        };
        this.setHour = function (h, min) {
            Array.prototype.forEach.call(this.svg.getElementsByClassName('hour'), function (el) {
                el.classList.remove('hour');
            });
            this.svg.getElementById('h_' + (h % 12)).classList.add('hour');
            this.hour.line.setAttribute('transform', 'rotate(' + (h * 30 + min * 0.5) + ' , ' + this.min.x + ' , ' + this.min.y + ')');
        };
        this.setTime = function (h, min) {
            this.setMin(min);
            this.setHour(h, min);
        };
    }])
    .controller('ClockCtrl', ['$scope', 'Clock', function ($scope, Clock) {
        $scope.setTime = function (h, m) {
            Clock.setTime(h, m);
        };
    }])
    .directive('clock', ['Clock', function (Clock) {
        return {
            restrict: 'E',
            templateUrl: '/ng-views/components/clock.html',
            controller: 'ClockCtrl',
            link: function (scope, el) {
                var today = new Date();
                Clock.setSvg(el.find('svg')[0]);
                Clock.setTime(today.getHours(), today.getMinutes());
            }
        }
    }]);