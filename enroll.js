angular.module('Enroll', [])
    .controller('EnrollController', ['$scope', '$http', '$httpParamSerializerJQLike', function ($scope, $http, $httpParamSerializerJQLike) {
        $scope.how = ['Google', 'Посоветовали', 'Facebook', 'Другое'];
        $scope.student = {
            how: $scope.how[0]
        };
        function successCallback(response) {
            console.log(response);
        };
        function errorCallback(response) {
            console.log(response);
        };

        $scope.postEnroll = function (student) {
            student.course_id = $scope.enrollSchedule.course_id;
            student.modifier_id = $scope.enrollSchedule.modifier_id;
            $http({
                method: 'POST',
                url: '/enroll',
                data: $httpParamSerializerJQLike(student),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(successCallback, errorCallback);
            //$scope.showModal = true;
        };
    }])
    .directive('enrollModal', [function () {
        return {
            restrict: 'E',
            templateUrl: '/ng-views/components/enrollModal.html',
            controller: 'EnrollController',
            link: function (scope, el, arrts) {

            }
        }
    }])