/**
 * Created by lenka on 10/7/15.
 */
angular.module('Utils', [])
    .service('Utils', [function () {
        this.getCloses = function (dates, limit) {
            var limit = limit || Infinity;
            return _.reduce(dates, function (cur, prev) {
                if (prev.begin > Date.now() && cur.length < limit) {
                    cur.push(prev);
                }
                return cur;
            }, []);
        };

        this.groupByMonth = function (obj) {
            return _.reduce(obj, function (cur, prev) {
                var month = moment.months((new Date(prev.begin)).getMonth());
                _.defaults(cur, _.set({}, month, []));
                cur[month].push(prev);
                return cur;
            }, {})
        };
        this.groupTwo = function (obj, propsArr) {
            return _.reduce(obj, function (result, n) {
                return _.omit(_.merge(result, n, function () {
                    _.set(result, [propsArr.join('_'), n[propsArr[0]]], n[propsArr[1]]);
                }), propsArr);
            }, {});
        };
    }])
    .service('TimeUtils', [function () {
        this.secToMs = function (sec) {
            return sec * 1000;
        }

        this.minToMs = function (min) {
            return secToMs(min * 60);
        }

        this.hoursToMs = function (hours) {
            return minToMs(hours * 60);
        }

        this.daysToMs = function (days) {
            return hoursToMs(days * 24);
        }

        this.datesArray = function (startDate, endDate, ms) {
            var dates = [],
                start = +startDate,
                end = +endDate;
            while (start <= end) {
                dates.push(start);
                start += ms;
            }
            return dates;
        }

        this.getRepeatedDates = function (startDate, addMs, count) {
            var dates = [],
                start = +startDate;
            while (count) {
                dates.push(start);
                start += addMs;
                count--;
            }
            return dates;
        }

    }]);