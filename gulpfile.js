// Basic constants
const pump = require('pump');
const beeper = require('beeper');
const {series, watch, src, dest, parallel} = require('gulp');
const babel = require('gulp-babel');
const sass = require('gulp-sass');
const postCSS = require('gulp-postcss');
const tailwindCSS = require('tailwindcss');
const purgeCSS = require('gulp-purgecss');
const autoPrefixer = require('autoprefixer');
const customProperties = require('postcss-custom-properties');
const easyImport = require('postcss-easy-import');
const cssNano = require('cssnano');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync').create();
const gulpZip = require('gulp-zip');

// Const assigned assets paths
const paths = {
  style: {
    src: 'assets/css/main.scss',
    dest: 'assets/built/css/'
  },
  script: {
    src: 'assets/js/main.js',
    dest: 'assets/built/js/'
  }
};

// Const to Build a zip file 
const themeZip = require('./package.json').name + '.zip';
  
// Const to handle error
const handleError = (done) => {
    return function (err) {
        if (err) {
            beeper();
        }
        return done(err);
    };
};

//  .hbs files function
function hbs_files(done) {
    pump([
        src(['*.hbs', 'partials/*.hbs']),
        browserSync.stream()
    ], handleError(done));
}

// PurgeCSS execution function
function purge(done) {
    pump([
    src('assets/css/lib/*.css'),
    purgeCSS({
            content: ['*.hbs', 'partials/*.hbs']
        }),
        dest('assets/built/css/lib'),
    ], handleError(done));
}

// Function to build a minimal version of css file
function styles(done) {
    pump([
        src(paths.style.src, {sourcemaps: true}),
        sass.sync().on('error', sass.logError),
        postCSS([
            tailwindCSS,
            easyImport,
            customProperties({preserve: false}),
            autoPrefixer({
              cascade: false
              }),
            cssNano()
        ]),
        rename({
          basename: 'main',
          suffix: '.min'
        }),
        dest(paths.style.dest, {sourcemaps: '.'}),
        browserSync.stream()
    ], handleError(done));
}

// Function for minimal version of script file
function scripts(done) {
    pump([
        src(paths.script.src, {sourcemaps: true}),
        babel({
            presets: ['@babel/env']
        }),
        concat('main.min.js'),
        uglify(),
        dest(paths.script.dest, {sourcemaps: '.'}),
        browserSync.stream()
    ], handleError(done));
}

// Function to build zip theme file
function zip(done) {
    pump([
        src(['**', '!node_modules', '!node_modules/**','!dist', '!dist/**']),
        gulpZip(themeZip),
        dest('dist/')
    ], handleError(done));
}

// Const assigned for css, js, hbs file watcher and purgeCSS, browserload etc.
const styleWatcher = () => watch(['assets/css/*.scss', 'assets/css/**/*.scss'], styles);
const jsWatcher = () => watch('assets/js/main.js', scripts);
const hbsWatcher = () => watch(['*.hbs', 'partials/*.hbs'], hbs_files);
const purgeWatcher = () => watch(['*.hbs', 'partials/*.hbs'], purge);
const browserLoad = () => browserSync.init({proxy: "http://localhost:2368"});
const watcher = parallel(purgeWatcher, styleWatcher, jsWatcher, hbsWatcher, browserLoad);
const build = series(purge, styles, scripts);

// All exports
exports.styles = styles;
exports.purge = purge;
exports.scripts = scripts;
exports.build = build;
exports.zip = series(build, zip);
exports.default = series(build, watcher);
