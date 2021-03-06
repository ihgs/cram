'use strict';

class CourseService {

  constructor() {
    this.$get = [
      '$resource',
      function($resource) {
        var Course = $resource('/api/courses/:id', {id : '@id'},
                               {'update' : {method : 'PUT'}});
        return Course;
      }
    ];
  }
}
