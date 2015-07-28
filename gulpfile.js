'use strict';
// =======================================================================
// Gulp Plugins
// =======================================================================
var gulp = require('gulp-help')(require('gulp')),
    browserSync = require('browser-sync'),
    $ = require('gulp-load-plugins')({lazy: true}),
    browserify = require('browserify'),
    watchify = require('watchify'),
    del = require('del'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    runSequence = require('run-sequence');

// =======================================================================
// File Paths
// =======================================================================
var filePath = {
    build: {
        dest: './dist'
    },
    lint: {
        src: ['./app/*.js', './app/**/*.js']
    },
    browserify: {
        src: './app/app.js',
        watch: [
            '!./app/assets/libs/*.js',
            '!./app/assets/libs/**/*.js',
            '!./app/**/*.spec.js',
            './app/*.js', './app/**/*.js',
            '/app/**/*.html'
        ]
    },
    styles: {
        src: './app/app.less',
        watch: ['./app/app.less', './app/**/*.less']
    },
    assets: {
        images: {
            src: './app/assets/images/**/*',
            watch: ['./app/assets/images', './app/assets/images/**/*'],
            dest: './dist/images/'
        },
        fonts: {
            src: ['./node_modules/angular-ui-grid/*.{eot,svg,ttf,woff}'],
            dest: './dist/fonts/'
        }
    },
    vendorJS: {
        // These files will be bundled into a single vendor.js file that's called at the bottom of index.html
        src: [
            './node_modules/angular/angular.js',
            './node_modules/angular-material/angular-material.js',
            './node_modules/angular-ui-router/release/angular-ui-router.js',
            './node_modules/lodash/index.js',
            './node_modules/moment/moment.js'
        ]
    },
    vendorCSS: {
        src: [
            './node_modules/angular-material/angular-material.css'
        ]
    },
    copyIndex: {
        src: './app/index.html',
        watch: './app/index.html'
    },
    copyFavicon: {
        src: './app/favicon.ico'
    }
};

process.setMaxListeners(0);    // Disable max listeners for gulp

// =======================================================================
// Error Handling
// =======================================================================
function handleError(err) {
  $.util.log(err.toString());
  if (browserSync.active) {
    this.emit('end');
  } else {
    process.exit(1);
  }
}


// =======================================================================
// Server Task
// =======================================================================
var morgan  = require('morgan');
var http  = require('http');
var express = require('express'),
    server = express();
// Server settings
server.use(morgan('dev'));
server.use(express.static(filePath.build.dest));
// Redirects everything back to our index.html
server.all('/*', function(req, res) {
    res.sendFile(__dirname + '/', {
        root: filePath.build.dest
    });
});
// uncomment the "middleware" section when you are ready to connect to an API
gulp.task('server', function() {
  browserSync({
  	port: 3000,
  	ui: {
    	port: 3001
    },
    proxy: 'localhost:' + 3002
  });

  var s = http.createServer(server);
  s.on('error', function(err){
    if(err.code === 'EADDRINUSE'){
      $.util.log('Development server is already started at port ' + 3002);
    }
    else {
      throw err;
    }
  });

  s.listen(3002);
});


// =======================================================================
// Clean out dist folder contents on build
// =======================================================================
gulp.task('clean-dev', function() {
    del(['./dist/*.js',
        './dist/*.css',
        '!./dist/vendor.js',
        '!./dist/vendor.css',
        './dist/*.html',
        './dist/*.png',
        './dist/*.ico',
        './reports/**/*',
        './reports']);
});

gulp.task('clean-full', function() {
    del(['./dist/*',
        './reports/**/*',
        './reports']);
});


// =======================================================================
// Browserify Bundle
// =======================================================================

var bundle = {};
bundle.conf = {
  entries: filePath.browserify.src,
  external: filePath.vendorJS.src,
  debug: true,
  cache: {},
  packageCache: {}
};

function rebundle() {
  return bundle.bundler.bundle()
    .pipe(source('bundle.js'))
    .on('error', handleError)
    .pipe(buffer())
    .pipe($.if(!bundle.prod, $.sourcemaps.init({
      loadMaps: true
    })))
    .pipe($.if(!bundle.prod, $.sourcemaps.write('./')))
    .pipe($.if(bundle.prod, $.streamify($.uglify({
      mangle: false
    }))))
    .pipe(gulp.dest(filePath.build.dest))
    .pipe($.if(browserSync.active, browserSync.reload({ stream: true, once: true })));
}

function configureBundle(prod) {
  bundle.bundler = watchify(browserify(bundle.conf));
  bundle.bundler.on('update', rebundle);
  bundle.prod = prod;
}

gulp.task('bundle-dev', function () {
  configureBundle(false);
  return rebundle();
});

gulp.task('bundle-prod', function () {
  configureBundle(true);
  return rebundle();
});


// =======================================================================
// Styles Task
// =======================================================================
gulp.task('styles-dev', function() {
  return gulp.src(filePath.styles.src)
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      sourceComments: bundle.prod ? 'none' : 'map',
      sourceMap: 'sass',
      outputStyle: bundle.prod ? 'compressed' : 'nested'
    }))
    .on('error', handleError)
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest(filePath.build.dest))
    .on('error', handleError)
    .pipe($.if(browserSync.active, browserSync.reload({ stream: true, once: true })));
});

gulp.task('styles-prod', function() {
  return gulp.src(filePath.styles.src)
    .pipe($.sass())
    .on('error', handleError)
    .pipe($.autoprefixer('last 1 version', '> 1%', 'ie 8', 'ie 7', {
      map: true
    }))
    .pipe($.minifyCSS())
    .pipe(gulp.dest(filePath.build.dest))
    .on('error', handleError)
    .pipe($.if(browserSync.active, browserSync.reload({ stream: true, once: true })));
});


// =======================================================================
// Images Task
// =======================================================================
gulp.task('images', function() {
  return gulp.src(filePath.assets.images.src)
    .on('error', handleError)
    .pipe($.if(bundle.prod, $.imagemin()))
    .pipe(gulp.dest(filePath.assets.images.dest))
    .pipe($.if(browserSync.active, browserSync.reload({ stream: true, once: true })));
});


// =======================================================================
// Fonts Task
// =======================================================================
gulp.task('fonts', function () {
  return gulp.src(filePath.assets.fonts.src)
    .on('error', handleError)
    .pipe(gulp.dest(filePath.assets.fonts.dest))
    .pipe($.if(browserSync.active, browserSync.reload({ stream: true, once: true })));
});


// =======================================================================
// Vendor JS Task
// =======================================================================
gulp.task('vendorJS', function() {
  var b = browserify({
    debug: true,
    require: filePath.vendorJS.src
  });

  return b.bundle()
    .pipe(source('vendor.js'))
    .on('error', handleError)
    .pipe(buffer())
    .pipe($.uglify())
    .pipe(gulp.dest(filePath.build.dest));
});


// =======================================================================
// Vendor CSS Task
// =======================================================================
gulp.task('vendorCSS', function() {
  return gulp.src(filePath.vendorCSS.src)
    .pipe($.concat('vendor.css'))
    .on('error', handleError)
    .pipe($.minifyCss())
    .pipe(gulp.dest(filePath.build.dest))
    .pipe($.if(browserSync.active, browserSync.reload({ stream: true, once: true })));
});


// =======================================================================
// Copy index.html
// =======================================================================
gulp.task('copyIndex', function() {
  return gulp.src(filePath.copyIndex.src)
    .pipe(gulp.dest(filePath.build.dest))
    .pipe($.if(browserSync.active, browserSync.reload({ stream: true, once: true })));
});


// =======================================================================
// Copy Favicon
// =======================================================================
gulp.task('copyFavicon', function() {
    return gulp.src(filePath.copyFavicon.src)
    .pipe(gulp.dest(filePath.build.dest));
});


// =======================================================================
// Watch for changes
// =======================================================================
gulp.task('watch', function() {
    gulp.watch(filePath.styles.watch, ['styles-dev']);
    gulp.watch(filePath.assets.images.watch, ['images']);
    gulp.watch(filePath.vendorJS.src, ['vendorJS']);
    gulp.watch(filePath.vendorCSS.src, ['vendorCSS']);
    gulp.watch(filePath.copyIndex.watch, ['copyIndex']);
    $.util.log('Watching...');
});


// =======================================================================
// Sequential Build Rendering
// =======================================================================

// run "gulp" in terminal to build the DEV app
gulp.task('build-dev', function(callback) {
    runSequence(
        ['clean-dev'],
        // images and vendor tasks are removed to speed up build time. Use "gulp build" to do a full re-build of the dev app.
        ['bundle-dev', 'styles-dev', 'copyIndex', 'copyFavicon'], ['server', 'watch'],
        callback
    );
});

// run "gulp prod" in terminal to build the PROD-ready app
gulp.task('build-prod', function(callback) {
    runSequence(
        ['clean-full'],
        ['bundle-prod', 'styles-prod', 'images', 'fonts', 'vendorJS', 'vendorCSS', 'copyIndex', 'copyFavicon'],
        ['server'],
        callback
    );
});

// run "gulp build" in terminal for a full re-build in DEV
gulp.task('build', function(callback) {
    runSequence(
        ['clean-full'],
        ['bundle-dev', 'styles-dev', 'images', 'fonts', 'vendorJS', 'vendorCSS', 'copyIndex', 'copyFavicon'],
        ['server', 'watch'],
        callback
    );
});

gulp.task('default', ['build-dev']);
gulp.task('prod', ['build-prod']);
