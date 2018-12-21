const { dest, src, parallel, watch } = require('gulp');
const postcss = require('gulp-postcss');
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const browserSync = require('browser-sync').create();

sass.compiler = require('node-sass');

function scss() {
    return src('src/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss())
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(dest('dst/'))
        .pipe(browserSync.stream());
}

function browser() {
    browserSync.init({
        server: {
            baseDir: './'
        }
    });

    watch('src/*.scss', scss);
    watch('./*.html').on('change', browserSync.reload);
}

exports.default = parallel(browser, scss);
