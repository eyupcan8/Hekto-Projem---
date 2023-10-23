const gulp = require("gulp");
var pkg = require("./package.json");
const sass = require('gulp-sass')(require('sass'));
const minify = require("gulp-minify");
const concat = require("gulp-concat");
const autoprefixer = require("gulp-autoprefixer");
const browserSync = require("browser-sync").create();

function style() {
  return gulp
    .src("./ui/scss/style.scss")
    .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
    .pipe(autoprefixer())
    .pipe(concat(`${pkg.name}.min.css`))
    .pipe(gulp.dest("./public/assets/styles/"))
    .pipe(browserSync.stream());
}

function scriptsApp() {
  return (
    gulp
      .src("./ui/scripts/**/*.js")
      .pipe(concat(`${pkg.name}.app.js`))
      // .pipe(concat.header("$(function() {\n"))
      // .pipe(concat.footer("\n});\n"))
      .pipe(
        minify({
          ext: {
            src: ".js",
            min: ".min.js"
          }
        })
      )
      .pipe(gulp.dest("./public/assets/scripts/"))
      .pipe(browserSync.stream())
  );
}
    
function scriptsLib() {
  return gulp
    .src([  
      "./node_modules/jquery/dist/jquery.js",
      "./node_modules/owl.carousel/dist/owl.carousel.min.js",
      "./node_modules/lazysizes/lazysizes.js",
      "./node_modules/bootstrap/dist/js/bootstrap.bundle.min.js",   
    ])
    .pipe(concat(`${pkg.name}.lib.js`))
    .pipe(
      minify({
        ext: {
          src: ".js",
          min: ".min.js"
        }
      })
    )
    .pipe(gulp.dest("./public/assets/scripts/"));
}

function watch() {
  gulp.watch("./ui/scss/**/*.scss", style);
  gulp.watch("./ui/scripts/**/*.js", scriptsApp);
}

function defaultTask() { 
  browserSync.init({
    server: {
      baseDir: "./public"
    },
    port: 3010
  });
  gulp.watch("./ui/scss/**/*.scss", style);
  gulp.watch("./ui/scripts/**/*.js", scriptsApp);
  gulp.watch("./public/*.html").on("change", browserSync.reload);
}

exports.scripts = gulp.series(scriptsLib, scriptsApp);
exports.js = scriptsApp;
exports.style = style;
exports.watch = watch;
exports.default = defaultTask;
