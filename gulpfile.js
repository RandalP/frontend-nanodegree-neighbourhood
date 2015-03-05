'use strict';

var gulp = require('gulp');
var sequence = require('run-sequence');
var browserSync = require('browser-sync');
var smoosher = require('gulp-smoosher');
var print = require('gulp-print');
var psi = require('psi');
var site = '';
var siteDir = './site';
var portNum = 8080;

gulp.task('css', function() {
	var minifyCss = require('gulp-minify-css');
  var autoprefixer = require('gulp-autoprefixer');

	return gulp.src(['css/*'], { base: './' })
    .pipe(autoprefixer({ cascade: false }))
    .pipe(minifyCss())
    .pipe(gulp.dest(siteDir));
});

gulp.task('move', function() {
  return gulp.src(['*.html'], { base: './' })
    .pipe(gulp.dest(siteDir));
});

gulp.task('html', ['move'], function() {
  var minifyHtml = require('gulp-minify-html');
  var opts = { }; // comments: true, spare:true

  return gulp.src(siteDir + '/*.html')
    .pipe(smoosher({base : siteDir}))
    .pipe(minifyHtml(opts))
    .pipe(gulp.dest(siteDir));
});

gulp.task('img', function() {
	var imagemin = require('gulp-imagemin');
	var pngquant = require('imagemin-pngquant');
  var mozjpeg = require('imagemin-mozjpeg');

  return gulp.src(['img/*'], { base: './' })
    .pipe(imagemin({
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        use: [pngquant(), mozjpeg()]
    }))
    .pipe(gulp.dest(siteDir));
});

gulp.task('jshint', function() {
    var stylish = require('jshint-stylish');
    var jshint = require("gulp-jshint");

  return gulp.src(['js/*'])
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});

gulp.task('js', function() {
  var uglify = require('gulp-uglify');

  return gulp.src(['js/*'], { base: './' })
    .pipe(uglify())
    .pipe(gulp.dest(siteDir));
});

gulp.task('browser-sync-psi', function() {
	browserSync({
    	port: portNum,
    	open: false,
        server: {
        	baseDir: siteDir
        }
    });
});

gulp.task('ngrok-url', function(cb) {
  var ngrok = require('ngrok');

  return ngrok.connect(portNum, function (err, url) {
      site = url;
      console.log('serving your tunnel from: ' + site);
      cb();
  });
});

gulp.task('ngrok', function() {
  return sequence(
    'browser-sync-psi',
    'ngrok-url');
});

gulp.task('psi-desktop', function () {
  console.log("desktop: " + site);
  return psi(site, {
      nokey: 'true',
      threshold: '90',
      strategy: 'desktop'
  }, function(err, data) {
    console.log("desktop: " + data.score);
    console.log(data.pageStats);
  });
 });

gulp.task('psi-mobile', function () {
  console.log("mobile: " + site);
  return psi(site, {
      nokey: 'true',
      threshold: '90',
      strategy: 'mobile'
  }, function(err, data) {
    console.log("mobile: " + data.score);
    console.log(data.pageStats);
  });
});

gulp.task('psi-seq', function (cb) {
	return sequence(
		'browser-sync-psi',
  	'ngrok-url',
  	'psi-desktop',
  	'psi-mobile',
  	cb);
});

gulp.task('psi', ['psi-seq'], function() {
  console.log("finished psi");
	process.exit();
});

gulp.task('psi-remote', ['psi-github'], function() {
  process.exit();
});


gulp.task('clean', function() {
  var del = require('del');
  del(siteDir);
});

gulp.task('assets', ['img', 'css', 'js']);

gulp.task('default', function() {
	return sequence('clean', 'assets', 'html');
});

function errorHandler (error) {
  console.log(error.toString());
  this.emit('end');
}
