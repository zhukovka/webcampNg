angular.module('Calendar', [])
    .service('Calendar', [function () {
        this.msToSec = function (ms) {
            return ms / 1000;
        };
        this.msToMin = function (ms) {
            return this.msToSec(ms) / 60;
        };
        this.msToH = function (ms) {
            return this.msToMin(ms) / 60;
        };
        this.msToDay = function (ms) {
            return this.msToH(ms) / 24;
        };
        this.secToMs = function (sec) {
            return sec * 1000;
        };

        this.minToMs = function (min) {
            return this.secToMs(min * 60);
        };

        this.hoursToMs = function (hours) {
            return this.minToMs(hours * 60);
        };

        this.daysToMs = function (days) {
            return this.hoursToMs(days * 24);
        };

        this.datesArray = function (startDate, endDate, ms) {
            var dates = [],
                start = +startDate,
                end = +endDate;
            while (start <= end) {
                dates.push(start);
                start += ms;
            }
            return dates;
        };
        this.addToDate = function (startDate, add) {
            var dst = 0;
            var date = new Date(+startDate + add);
            if (date.getTimezoneOffset() != startDate.getTimezoneOffset()) {
                var dst = date.getTimezoneOffset() - startDate.getTimezoneOffset();
                return this.addToDate(date, this.minToMs(dst));
            }
            return date;
        };

        this.getRepeatedDates = function (start, addMs, count) {
            var dates = [],
                startDate = new Date(start);
            dates.push(startDate);
            while (count > 1) {
                startDate = this.addToDate(startDate, addMs);
                dates.push(startDate);
                count--;
            }
            return dates;
        };
        this.getRepeatedDaysIntervals = function (start, intervals, count) {
            if (!start) {
                return;
            }

            var addDays = 0,
                dates = [],
                startDate = new Date(start);
            dates.push(startDate);

            while (dates.length < count) {
                for (var i = 0; i < intervals.length - 1; i++) {
                    addDays = this.daysToMs(intervals[i + 1] - intervals[i]);
                    startDate = this.addToDate(startDate, addDays);
                    if (dates.push(startDate) >= count) {
                        return dates;
                    }
                }
                addDays = this.daysToMs(7 % intervals[intervals.length - 1] + intervals[0] % 7);
                startDate = this.addToDate(startDate, addDays);
                dates.push(startDate);
            }
            return dates;
        };

        this.calendarView = function (days) {
            var calendar = [];
            var daysOffset = (days[0].getDay() || 7) - 1;
            var weeksCount = Math.ceil((days.length + daysOffset) / 7);
            var start = 0;
            for (var i = 0; i < weeksCount; i++) {
                calendar[i] = [];
                for (var j = 0; j < 7; j++) {
                    if (daysOffset > start || (start - daysOffset) >= days.length) {
                        calendar[i][j] = '';
                    } else {
                        calendar[i][j] = days[start - daysOffset];
                    }
                    start++;
                }
            }
            return calendar;
        };
        this.isTheDay = function (day, day2) {
            if (day && day2) {
                return day.getDate && day2.getDate && day2.toDateString() == day.toDateString();
            }
            return false;
        };
        this.daysMap = {
            Monday: "Понедельник",
            Tuesday: "Вторник",
            Wednesday: "Среда",
            Thursday: "Четверг",
            Friday: "Пятница",
            Saturday: "Суббота",
            Sunday: "Воскресенье"
        };
        this.monthMap = {
            January: "Январь",
            February: "Февраль",
            March: "Март",
            April: "Апрель",
            May: "Май",
            June: "Июнь",
            July: "Июль",
            August: "Август",
            September: "Сентябрь",
            October: "Октябрь",
            November: "Ноябрь",
            December: "Декабрь"
        };
        this.getMonthArray = function () {
            return _.values(this.monthMap);
        };
        this.daysInMonth = function (year, month) {
            var m1 = new Date(year, month),
                next = (month + 1) / 12 | 0,
                m2 = new Date(year + next, (month + 1) % 12);
            return this.msToDay(m2 - m1) | 0;
        };

    }])
    .controller('calendarCtrl', ['$scope', 'Calendar', function ($scope, Calendar) {
        var today = new Date(),
            todayStart = moment().startOf('day'),
            start = moment().startOf('month');
        $scope.daysMap = Calendar.daysMap;
        $scope.datesInMonth = Calendar.getRepeatedDates(start, Calendar.daysToMs(1), start.daysInMonth());
        $scope.today = today;
        $scope.date = {
            year: today.getFullYear(),
            month: today.getMonth(),
            day: today.getDate(),
            weekDay: today.getDay()
        };
        $scope.years = _.range($scope.date.year, $scope.date.year + 10);
        $scope.months = Calendar.getMonthArray();
        $scope.calendarView = Calendar.calendarView($scope.datesInMonth);
        $scope.getMonthCalendar = function (year, month) {
            var start = new Date(year, month),
                dates = Calendar.getRepeatedDates(start, Calendar.daysToMs(1), Calendar.daysInMonth(year, month));
            return Calendar.calendarView(dates);
        };
        $scope.goOneMonth = function (m) {
            var month = ($scope.date.month || 12) + m,
                next = +(m > 0 && $scope.date.month == 11) || -(m < 0 && $scope.date.month == 0) || 0;
            $scope.goToMonth($scope.date.year + next, month);
        };
        $scope.goToMonth = function (y, m) {
            $scope.date.year = y;
            $scope.date.month = m % 12;
            $scope.calendarView = $scope.getMonthCalendar($scope.date.year, $scope.date.month);
        };
        console.log('calendar controller', $scope);

    }])
    .directive('calendar', ['Calendar', function (Calendar) {
        return {
            restrict: 'E',
            templateUrl: '/ng-views/components/calendar.html',
            link: function (scope, el) {
            },
            controller: 'calendarCtrl'
        }
    }]);