const gulp = require("gulp");

gulp.task('default', function () {
    const postcss = require('gulp-postcss')
  
    return gulp.src('styles.css')
      // ...
      .pipe(postcss([
        // ...
        require('tailwindcss'),
        require('autoprefixer'),
        // ...
      ]))
      // ...
      .pipe(gulp.dest('input/assets/css'))
  })