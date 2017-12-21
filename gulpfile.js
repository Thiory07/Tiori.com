var gulp = require('gulp');
var gs		= require('gulp-selectors');

gulp.task('default', function() {
  // place code for your default task here
  // string replacement for class selectors
  var paths = ['dist/index.html',
                  'dist/assets/css/common/main.min.css',
                  'dist/assets/js/main.min.js'];
  return gulp.src(paths, {base: "./"})
		.pipe(gs.run({
      'css': ['css'],
      'html': ['html'],
			'js-strings': ['js']
		},{
        classes: [
          'container',
          'row',
          'col-*',
          'mt-*',
          'mb-*',
          'pt-*',
          'pb-*',
          'fa',
          'fa-*',
          'dropdown',
          'btn',
          'btn-secondary',
          'dropdown-*',
          'hidden',
          'active',
          'site-section',
          'img-fluid',
          'pull-right',
          'js-*',
          'flag',
          'float-left',
          'flag-*'
        ],   // ignore these class selectors,
        ids: '*' //ignore all ids and fix problem with css colors
    }))
		.pipe(gs.info())
		.pipe(gulp.dest("./"));
});
