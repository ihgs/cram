'use strict';

class TextbookService {
  constructor() {
    this.$get = [
      '$resource',
      function($resource) {
        var Textbook = $resource('/admin/textbooks/:id.json', {id : '@id'}, {});
        return Textbook;
      }
    ];
  }
}
