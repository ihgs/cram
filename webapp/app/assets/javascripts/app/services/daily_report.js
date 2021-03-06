'use strict';

class DailyReportService {

  constructor() {
    this.$get = [
      '$resource',
      function($resource) {
        var DailyReport = $resource('/api/daily_reports/:id', {id : '@id'}, {
          'get' : {transformResponse : transformResponse},
          'update' : {method : 'PUT'}
        });
        return DailyReport;
      }
    ];

    function transformResponse(data) {
      data = angular.fromJson(data);

      data.date = new Date(data.date);

      if (data.homeworks != undefined) {
        for (let i = 0; i < data.homeworks.length; i++) {
          data.homeworks[i].due_date = new Date(data.homeworks[i].due_date);
        }
      }

      return data;
    }
  }
}
