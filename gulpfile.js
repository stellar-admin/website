const gulp = require("gulp");

gulp.task('default', function () {
    const postcss = require('gulp-postcss')
  
    return gulp.src('styles.css')
      .pipe(postcss([
        require('postcss-import'),
        require('tailwindcss'),
        require('autoprefixer'),
        require('postcss-nested')
      ]))
      .pipe(gulp.dest('input/assets/css'))
  })