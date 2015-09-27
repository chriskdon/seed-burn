var gulp = require('gulp');
var webserver = require('gulp-webserver');
var source = require('vinyl-source-stream');
var gutil = require('gulp-util');
var browserify = require('browserify');
var reactify = require('reactify');
var watchify = require('watchify');
var notify = require("gulp-notify");
var less = require('gulp-less');
var path = require('path');
var rename = require('gulp-rename');
var watch = require('gulp-watch');
var babelify = require('babelify');

var config = {
  publicAppRoot: 'app/public/',
  styles: {
    less: {
      directory: 'app/styles',
      output: {
        directory: 'app/public/css',
        file: 'app.bundle.css'
      }
    }
  },
  src: {
    client: {
      directory: 'app/src/client',
      main: 'index.js',
      output: {
        directory: 'app/public/js',
        file: 'app.bundle.js'
      }
    }
  }
};

var buildDir = 'app/public/js';

// Based on: http://blog.avisi.nl/2014/04/25/how-to-keep-a-fast-build-with-browserify-and-reactjs/
function buildScript(watch) {
  var client = config.src.client;
  var scriptsDir = client.directory;
  var mainFile = client.main;
  var outputDir = client.output.directory;
  var outputFile = client.output.file;

  var props = watchify.args;
  props.entries = [scriptsDir + '/' + mainFile];
  props.debug = true;

  var bundler = watch ? watchify(browserify(props)) : browserify(props);

  bundler.transform(babelify);

  function rebundle() {
    var stream = bundler.bundle();
    return stream.on('error', notify.onError({
        title: "Compile Error",
        message: "<%= error.message %>"
      }))
      .pipe(source(outputFile))
      .pipe(gulp.dest(outputDir + '/'));
  }

  bundler.on('update', function() {
    rebundle();
    gutil.log('Rebundle...');
  });

  return rebundle();
}

gulp.task('js', function() {
  return buildScript(false); // Don't watch
});

gulp.task('js:watch', function() {
  return buildScript(true); // Watch
});

gulp.task('less', function () {
  var styles = config.styles.less;
  var searchPath = styles.directory + '/**/*.less';
  var outputDir = styles.output.directory;
  var outputFile = styles.output.file;

  return gulp.src(searchPath)
    .pipe(less({
      paths: [path.join(__dirname, 'less', 'includes')]
    }))
    .pipe(rename(outputFile))
    .pipe(gulp.dest(outputDir));
});

gulp.task('less:watch', ['less'], function() {
  var watchPath = config.styles.less.directory + '/**/*.less';
  gulp.watch(watchPath, ['less']);
});

gulp.task('watch', ['js:watch', 'less:watch']);

gulp.task('webserver', function() {
  gulp.src(config.publicAppRoot)
    .pipe(webserver({
      fallback: 'index.html',
      livereload: true,
      directoryListing: false,
      open: true
    }));
});

gulp.task('default', ['webserver', 'watch']);
