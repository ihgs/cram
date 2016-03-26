'use strict';

class StudentService {
  constructor() {
    this.$get = [
      '$resource',
      function($resource) {
        var Student = $resource('/api/students/:id.json', {id : '@id'}, {});
        return Student;
      }
    ];
  }
}