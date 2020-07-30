const gulp = require("gulp");
const chalk = require("chalk");
const del = require("del");
const plumber = require("gulp-plumber");
const postcss = require("gulp-postcss");
const uncss = require("postcss-uncss");
const cssnano = require("cssnano");
const concat = require("gulp-concat");
const stripDebug = require("gulp-strip-debug");
const terser = require("gulp-terser");
const rename = require("gulp-rename");
const htmlReplace = require("gulp-html-replace");
const fs = require("fs");
const prettyBytes = require("pretty-bytes");
const getFolderSize = require("get-folder-size");

const deleteFiles = async (extension = "", directory = "dist") => {
  try {
    await del(`${directory}/*${extension}`);
  } catch (error) {
    console.log(
      `${chalk.red(
        `Error deleting ${extension} files in dist folder`
      )}: ${error}`
    );
  }
  // Delete any files in the directory argument matching the extension argument
};

const plumberErrorHandler = (error) =>
  console.log(`${chalk.red("Error:")} ${error}`);
// Create a function for handling errors caught by the plumber plugin

const css = async () => {
  deleteFiles(".css");

  const postCssPlugins = [
    uncss({
      html: ["src/index.html"],
      ignore: [
        ".banner-image-background",
        ".no-blur",
        ".blur-out",
        ".fade-in-slide-up",
        ".nav-shown",
      ],
    }),
    cssnano(),
  ];

  return new Promise((resolve, reject) => {
    gulp
      .src("src/css/**/*.css")
      .pipe(plumber({ errorHandler: plumberErrorHandler }))
      .pipe(concat("style.min.css"))
      .pipe(postcss(postCssPlugins))
      .pipe(gulp.dest("dist"))
      .on("error", reject)
      .on("end", resolve);
  });
};

const js = async () => {
  deleteFiles(".js");

  return new Promise((resolve, reject) => {
    gulp
      .src("src/js/**/*.js")
      .pipe(plumber({ errorHandler: plumberErrorHandler }))
      .pipe(stripDebug())
      .pipe(terser())
      .pipe(rename((path) => (path.extname = ".min.js")))
      .pipe(gulp.dest("dist"))
      .on("error", reject)
      .on("end", resolve);
  });
};

const html = async () => {
  deleteFiles("index.html");

  return new Promise((resolve, reject) => {
    gulp
      .src("src/index.html")
      .pipe(plumber({ errorHandler: plumberErrorHandler }))
      .pipe(
        htmlReplace({
          css: "dist/style.min.css",
          js: {
            src: "dist/script.js",
            tpl: `<script type="module" src="%s"></script>`,
          },
        })
      )
      .pipe(gulp.dest("./"))
      .on("error", reject)
      .on("end", resolve);
  });
};

const logBundleSize = () =>
  new Promise((resolve, reject) => {
    try {
      getFolderSize("./dist", (error, size) => {
        if (error) {
          reject(error);
        }
        resolve(console.log(`Bundle size: ${prettyBytes(size)}`));
      });
      // Use prettyBytes to display the combined size of CSS and JS files
    } catch (error) {
      reject(error);
    }
  });

const watch = () => {
  gulp.watch("src/css/**/*.css", gulp.series(css, logBundleSize));
  gulp.watch("src/js/**/*.js", gulp.series(js, logBundleSize));
  gulp.watch("src/index.html", html);
};

gulp.task("default", gulp.series(css, js, html, logBundleSize));
gulp.task("watch", gulp.series(css, js, html, logBundleSize, watch));
