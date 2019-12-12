const { dest, src, series, watch } = require('gulp');
const autoprefixer = require('autoprefixer');
const browserSync = require('browser-sync').create();
const cleanCSS = require('gulp-clean-css');
const postcss = require('gulp-postcss');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');

sass.compiler = require('node-sass');

const Paths = {
    BASE_PATH: './',
    SCSS: {
        SRC: 'src/*.scss',
        DST: 'dst/'
    },
    HTML: './*.html'
}

const browserSyncConfig = {
    server: {
        baseDir: Paths.BASE_PATH
    }
};

const cleanCSSConfig = {
    compatibility: 'ie8'
};

function scss() {
    return src(Paths.SCSS.SRC)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(dest('dst/'))
        .pipe(browserSync.stream());
}

function browser() {
    browserSync.init(browserSyncConfig);

    watch(Paths.SCSS.SRC, scss);
    watch(Paths.HTML).on('change', browserSync.reload);
}

function build() {
    const plugins = [
        autoprefixer()
    ];
    return src(Paths.SCSS.SRC)
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss(plugins))
        .pipe(cleanCSS(cleanCSSConfig))
        .pipe(dest(Paths.SCSS.DST));
}

exports.scss = scss;

if (process.env.NODE_ENV === 'production') {
    exports.default = build;
} else {
    exports.default = series(scss, browser);
}
