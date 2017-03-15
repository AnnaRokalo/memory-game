var gulp = require('gulp');
var rimraf = require('rimraf');
var fs = require('fs');

// Dealing with styles
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');

// Server and livereload
var browserSync = require('browser-sync');
var runSequence = require('run-sequence');

var cssInput = ['./scss/styles.scss'];
var cssOutput = './css/';

var sassOptions = {
    errLogToConsole: true,
    outputStyle: 'expanded'
};

var autoprefixerOptions = {
    "browsers": ["last 2 versions", "> 5%", "Firefox ESR"]
};


var pug = require('gulp-pug');

// чтобы запустить эту задачу, наберите в командной строке gulp jade
gulp.task('pug', function() {
    return gulp.src('./pug/*.pug')
        .pipe(pug())
        .pipe(gulp.dest('./')); // указываем gulp куда положить скомпилированные HTML файлы
});

// Run dev server with browserSync.
gulp.task('browserSync', function () {
    return browserSync({
        server: {
            baseDir: './'
        }
    });
});

// Compile sass, generate prefixes.
gulp.task('sass', function () {
    return gulp.src(cssInput)
        .pipe(sass(sassOptions))
        .pipe(autoprefixer(autoprefixerOptions))
        .pipe(gulp.dest(cssOutput));
});

// Clean css folder, to be sure we are using up to date styles.
gulp.task('clean-css', function (cb) {
    return rimraf('./css/styles.css', cb);
});

// Watchers.
gulp.task('watch', ['browserSync'], function () {
    gulp.watch('./scss/*.scss', ['sass']);
    gulp.watch('./pug/*.pug', ['pug']);
    // gulp.watch('./*.html', browserSync.reload);
    gulp.watch('./js/*.js', browserSync.reload);
});

gulp.task('default', function (callback) {
    runSequence(['clean-css', 'sass', 'pug', 'browserSync', 'watch'],
        callback
    );
});