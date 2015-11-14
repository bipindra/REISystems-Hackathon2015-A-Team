/// <binding Clean='clean' />

var gulp = require("gulp"),
    rimraf = require("rimraf"),
    concat = require("gulp-concat"),
    cssmin = require("gulp-cssmin"),
    uglify = require("gulp-uglify"),
    project = require("./project.json"),
    jasmine = require("gulp-jasmine");


var paths = {
    webroot: "./" + project.webroot + "/"
};

paths.js = paths.webroot + "js/**/*.js";
paths.minJs = paths.webroot + "js/**/*.min.js";
paths.css = paths.webroot + "css/**/*.css";
paths.minCss = paths.webroot + "css/**/*.min.css";
paths.concatJsDest = paths.webroot + "js/app.min.js";
paths.concatCssDest = paths.webroot + "css/app.min.css";

//gulp.task("default",['clean','min'],function(){
//    console.log("Hello Default task.");
//});

var dnx = require("gulp-dnx");
gulp.task('default', function (cb) {

    return gulp.start('dnx-run');
});

var options = {
    restore: true,
    build: true,
    run: true,
    cwd: './'
};
var dnxCommand = '. web';
gulp.task('dnx-run', dnx(dnxCommand, options));

gulp.task("clean:js", function (cb) {
    rimraf(paths.concatJsDest, cb);
});

gulp.task("clean:css", function (cb) {
    rimraf(paths.concatCssDest, cb);
});

gulp.task("clean", ["clean:js", "clean:css"]);

gulp.task("min:js", function () {
    gulp.src([paths.js, "!" + paths.minJs], { base: "." })
        .pipe(concat(paths.concatJsDest))
        .pipe(uglify())
        .pipe(gulp.dest("."));
});

gulp.task("min:css", function () {
    gulp.src([paths.css, "!" + paths.minCss])
        .pipe(concat(paths.concatCssDest))
        .pipe(cssmin())
        .pipe(gulp.dest("."));
});

gulp.task("min", ["min:js", "min:css"]);

gulp.task("test", function () {
    return gulp.src('wwwroot/tests/test.js')
        // gulp-jasmine works on filepaths so you can't have any plugins before it 
        .pipe(jasmine());
});
