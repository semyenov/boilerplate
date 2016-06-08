'use strict';

var gulp          = require('gulp');
var gulpSass      = require('gulp-sass');
var connect       = require('gulp-connect');
var opn           = require('opn');
var uncss         = require('gulp-uncss');
var rimraf        = require('rimraf');
var yargs         = require('yargs');
var autoprefixer  = require('gulp-autoprefixer');
var sourcemaps    = require('gulp-sourcemaps');
var gulpif        = require('gulp-if');
var panini        = require('panini');
var fs            = require('fs');
var yaml          = require('js-yaml');
var cssnano       = require('gulp-cssnano');
var concat       = require('gulp-concat');
var uglify       = require('gulp-uglify');
var imagemin       = require('gulp-imagemin');

// Check for --production flag
const PRODUCTION = !!(yargs.argv.production);

// Load settings from settings.yml
var config = loadConfig();
const COMPATIBILITY  = config.COMPATIBILITY;
const PORT           = config.PORT;
const UNCSS_OPTIONS  = config.UNCSS_OPTIONS;
const PATHS          = config.PATHS;

var server = {
  host: 'localhost',
  port: PORT,
  root: PATHS.dist,
  livereload: true
};

function loadConfig() {
  let ymlFile = fs.readFileSync('config.yml', 'utf8');
  return yaml.load(ymlFile);
}

gulp.task('build',
 gulp.series(clean, gulp.parallel(pages, sass, javascript, images, copy)));
gulp.task('default',
  gulp.series('build', webserver, watch, openbrowser));

function clean(done) {
  rimraf(PATHS.dist, done);
}

function sass() {
  return gulp.src( 'src/assets/scss/styles.scss' )
    .pipe(gulpSass({
      includePaths: PATHS.sass
    })
      .on('error', gulpSass.logError))
     .pipe(autoprefixer({
       browsers: COMPATIBILITY
     }))
    .pipe(gulpif(PRODUCTION, uncss(UNCSS_OPTIONS)))
    .pipe(gulpif(PRODUCTION, cssnano()))
    .pipe(gulpif(!PRODUCTION, sourcemaps.write()))
    .pipe(gulp.dest(PATHS.dist + '/assets/css'))
    .pipe(connect.reload());
}

function pages() {
  return gulp.src('src/pages/**/*.{html,hbs,handlebars}')
    .pipe(panini({
      root: 'src/pages/',
      layouts: 'src/layouts/',
      partials: 'src/partials/',
      data: 'src/data/',
      helpers: 'src/helpers/'
    }))
    .pipe(gulp.dest(PATHS.dist))
    .pipe(connect.reload());
}

function resetPages(done) {
  panini.refresh();
  return done();
}

function copy() {
  return gulp.src(PATHS.assets)
    .pipe(gulp.dest(PATHS.dist + '/assets'));
}

function javascript() {
  return gulp.src( PATHS.javascript )
    .pipe(sourcemaps.init())
    .pipe(concat('common.js'))
    .pipe(gulpif(PRODUCTION, uglify()
      .on('error', e => { console.log(e); })
    ))
    .pipe(gulpif(!PRODUCTION, sourcemaps.write()))
    .pipe(gulp.dest(PATHS.dist + '/assets/js'))
    .pipe(connect.reload());
}

function images() {
  return gulp.src('src/assets/img/**/*')
    .pipe(gulpif(PRODUCTION, imagemin({
      progressive: true
    }).on('error', e => { console.log(e); })))
    .pipe(gulp.dest(PATHS.dist + '/assets/img'))
    .pipe(connect.reload());
}

function webserver(done) {
  connect.server(server);
  return done();
}

function openbrowser(done) {
  opn( 'http://' + server.host + ':' + PORT );
  done();
}

function watch(done) {
  gulp.watch(PATHS.assets + '**/*', copy);
  gulp.watch('src/pages/**/*.html', gulp.series(pages));
  gulp.watch('src/{layouts,partials}/**/*.html', gulp.series(resetPages, pages));
  gulp.watch('src/assets/scss/**/*.scss', gulp.series(sass));
  gulp.watch('src/assets/js/**/*.js', gulp.series(javascript));
  gulp.watch('src/assets/img/**/*', gulp.series(images));
  return done();
}
