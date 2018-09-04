// Creating an Angular constant and rendering a list of items as JSON

angular.module('fl.ngdoc')
    .constant('{$ doc.name $}', {$ doc | json $});
