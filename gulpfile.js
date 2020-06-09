const { series, src, dest, watch } = require('gulp');
const htmlClean = require('gulp-htmlclean');
const less = require('gulp-less');
const cleanCss = require('gulp-clean-css')
const stripDebug = require('gulp-strip-debug')
const uglify = require('gulp-uglify')
// const imgMin = require('gulp-imagemin')
const tinypng = require('gulp-tinypng-compress');
const connect = require('gulp-connect');

const folder = {
    src: 'src/',
    dist: 'dist/'
}

function html() {
    return src(folder.src + 'html/*')
        .pipe(htmlClean())
        .pipe(dest(folder.dist + 'html/'))
        .pipe(connect.reload())
}

function css() {
    return src(folder.src + 'css/*')
        .pipe(less())
        .pipe(cleanCss())
        .pipe(dest(folder.dist + 'css/'))
        .pipe(connect.reload())
}

function js() {
    return src(folder.src + 'js/*')
        // .pipe(stripDebug())
        // .pipe(uglify())
        .pipe(dest(folder.dist + 'js/'))
        .pipe(connect.reload())
}

function image() {
    return src(folder.src + 'images/*.{png,jpg,jpeg,gif,ico}')
    // .pipe(imgMin())
    .pipe(tinypng({
        key: 'KxmD3GLXdtZbB0PcR5PFqtybHXny5hyd',
        sigFile: `${folder.dist}images/.tinypng-sigs`,
        log: true
    }))
    .pipe(dest(folder.dist + 'images/'))
}

function server(cb) {
    connect.server({
        port: '12306',
        livereload: true // 自动刷新
    })
    cb()
}

watch(folder.src + 'html/*', cb => {
    html();
    cb();
})
watch(folder.src + 'css/*', cb => {
    css();
    cb();
})
watch(folder.src + 'js/*', cb => {
    js();
    cb();
})

exports.default = series(html, css, js, image, server);