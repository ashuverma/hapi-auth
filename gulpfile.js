'use strict';

var Gulp = require('gulp');
var plugins = require('gulp-load-plugins')();


/**
 * jshint
 */
Gulp.task('jshint', function () {
    return Gulp.src(['lib/**/*.js', 'gulpfile.js'])
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter('jshint-stylish'));
});

/**
 * Start a dev server locally
 */
Gulp.task('develop', function () {
    plugins.nodemon({
        script: 'examples/index.js',
        port: 3000,
        watch: ['lib/**/*.js', '!node_modules/**', 'examples/index.js'],
        ext: 'js',
        env: { 'NODE_ENV': 'development' }
    })
    .on('change', ['jshint'])
    .on('restart', function () {
        console.log('server restarted');
    });
});


/**
 * Tests for server
 */
Gulp.task('tests', function () {
    return Gulp.src('test')
        .pipe(plugins.lab());
});

/**
 * Default task
 */
Gulp.task('default', ['jshint', 'develop'], function () {
    console.log('Starting Dev Server');
});
