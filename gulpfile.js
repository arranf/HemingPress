var gulp = require('gulp'),
    stylus = require('gulp-stylus')
    autoprefixer = require('gulp-autoprefixer'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    flatten = require('gulp-flatten');

var styleLocation = 'styles/**/*{.styl,.svg}'
var themeLocation = 'styles/**/theme.styl';
var jsLocation = 'js/**/*.js'
var buildLocation = 'static/';

gulp.task("default", function () {

  gulp.src(jsLocation)
   .pipe(concat('main.js'))
   .pipe(gulp.dest(buildLocation + 'js/'));

  gulp.src(themeLocation)
    .pipe(stylus({compress: true}))
    .pipe(autoprefixer())
    .pipe(flatten())
    .pipe(gulp.dest(buildLocation + 'css'));

    gulp.src('styles/**/*.svg')
      .pipe(gulp.dest(buildLocation + 'css/'));
});

gulp.task("watch", function () {
  gulp.watch(styleLocation, function() {
    gulp.src(themeLocation)
      .pipe(stylus({compress: true}))
      .pipe(autoprefixer())
      .pipe(gulp.dest(buildLocation + 'css/'));

    gulp.src('styles/**/*.svg')
      .pipe(gulp.dest(buildLocation + 'css/'));
  });
  gulp.watch(jsLocation, function () {
      gulp.src(jsLocation)
        .pipe(concat('main.js'))
        .pipe(gulp.dest(buildLocation + 'js/'));
  });
});
