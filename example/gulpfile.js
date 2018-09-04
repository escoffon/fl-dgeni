const gulp = require('gulp');
const Dgeni = require('dgeni');
const del = require('del');
const runSequence = require('run-sequence');

gulp.task('dgeni', function(cb) {
	      runSequence('cleandocs', [ 'dgeni-docs' ], cb);
	  });

gulp.task('dgeni-docs', function() {
  try {
    var dgeni = new Dgeni([require('./doc/dgeni/conf')]);
    return dgeni.generate();
  } catch(x) {
    console.log(x.stack);
    throw x;
  }
});

gulp.task('cleandocs', function(done) {
	      return del(['./doc/out/dgeni', './public/doc/out/dgeni'], done);
	  });

gulp.task('default', function(cb) {
	      runSequence('cleandocs', [ 'dgeni' ], cb);
});
