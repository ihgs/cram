'use strict';

class DailyReport {

  constructor() {
    this.date = new Date();
    this.grade = "";
    this.subject = "";
    this.students = [];
    this.contents = [ {} ];
    this.homeworks = [ {} ];
    this.test_result_pics = [];
    this.test_result_pic_data_list = [ "" ];
    this.blackboard_pics = [];
    this.blackboard_pic_data_list = [ "" ];

    this.note = "";
  }
}

angular.module('cram.daily_reports').controller('DailyReportsController', [
  '$stateParams', '$scope', '$http', '$window', '$filter', '$q',
  'DailyReportService', 'Student', 'Textbook',
  function($stateParams, $scope, $http, $window, $filter, $q,
           DailyReportService, Student, Textbook) {
    let id = $stateParams['id'];
    $scope.students = Student.query();
    if (id == undefined) {
      $scope.daily_report = new DailyReport();
      $scope.daily_report.students = $scope.students;
      $scope.action = "new";
    } else {
      $scope.daily_report = DailyReportService.get({'id' : id});
      $scope.action = "edit";
    }

    $scope.grade_list = [
      "小１", "小２", "小３", "小４", "小５", "小６", "中１", "中２", "中３",
      "高１", "高２", "高３"
    ];
    $scope.subject_list = [ "英語", "数学", "算数", "理科", "国語" ];

    $scope.all_textbooks = Textbook.query();
    $scope.textbooks = $scope.all_textbooks;

    $scope.$watch('daily_report.grade', function() {
      filterStudents();
      filterTextbooks();
    });
    $scope.$watch('daily_report.subject', filterTextbooks);

    $scope.add_content = function() { $scope.daily_report.contents.push({}); };

    $scope.delete_content = function(i) {
      $scope.daily_report.contents.splice(i, 1);
    };

    // $scope.add_blackboard_pic_data = function(){
    //   $scope.daily_report.blackboard_pic_data_list.push({})
    // }
    //
    // $scope.delete_blackboad_pic_data = function(i){
    //   $scope.daily_report.blackboard_pic_data_list.splice(i, 1);
    // }
    //
    // $scope.add_test_result_pic_data = function(){
    //   $scope.daily_report.test_result_pic_data_list.push({});
    // }
    //
    // $scope.delete_test_result_pic_data = function(i){
    //   $scope.daily_report.test_result_pic_data_list.splice(i, 1);
    // }

    $scope.add_homework = function() {
      $scope.daily_report.homeworks.push({});
    };

    $scope.delete_homework = function(i) {
      $scope.daily_report.homeworks.splice(i, 1);
    };

    $scope.submit = function() {
      $http({
        method : 'POST',
        url : '/api/daily_reports',
        data : {"daily_report" : $scope.daily_report}
      })
          .success(function(data, status, headers) {
            $window.location.href = `/admin/daily_reports/${data['id']}`;
          })
          .error(function(data, status, headers) { console.log(data); });
    };

    function filterStudents() {
      $scope.students.$promise.then(function(data) {
        function filter(element) {
          let selected_grade = $scope.daily_report.grade;
          if (selected_grade == null || selected_grade == '') {
            return true;
          }
          let current_school = element['current_school'];
          if (current_school == undefined) {
            return false;
          }

          let selected_grade_kind = selected_grade[0];
          let selected_grade_num =
              selected_grade[1].replace(/[０-９]/g, function(s) {
                return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
              });

          if (current_school.kind.indexOf(selected_grade_kind) == -1) {
            return false;
          }

          if (current_school.grade == selected_grade_num) {
            return true;
          }

          return false;
        }

        let students = [];
        data.forEach(function(item) {
          if (filter(item)) {
            for (let i in $scope.daily_report.students) {
              let stu = $scope.daily_report.students[i];
              if (item.id == stu.student_id) {
                item['attendance'] = stu['attendance'];
                item['test_result'] = stu['test_result'];
              }
            }
            if ($scope.action == "new") {
              item['attendance'] = true;
            }
            students.push(item);
          } else {
            // Nothing to do
          }

        });
        $scope.daily_report.students = students;
      });
    }

    function filterTextbooks() {
      $scope.all_textbooks.$promise.then(function(data) {
        $scope.textbooks = $filter('filter')(data, function(element) {
          let subject = $scope.daily_report.subject;
          let grade = $scope.daily_report.grade;

          return (subject == element['subject'] || subject == null) &&
                 (grade == element['grade'] || grade == null);
        });
      });
    }

  }
]);
