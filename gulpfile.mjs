import gulp from "gulp";
import * as dartSass from "sass";
import gulpSass from "gulp-sass";
import postcss from "gulp-postcss";
import cleanCSS from "gulp-clean-css";
import rename from "gulp-rename";
import browserSyncPkg from "browser-sync";
import ejs from "gulp-ejs";
import prettier from "gulp-prettier";
import { promises as fs, constants } from "fs";
import path from "path";
import { Transform } from "stream";
import prettierConfig from "./prettier.config.js";

const browserSync = browserSyncPkg.create();
const sass = gulpSass(dartSass);

const paths = {
  stylesSrc: "src/sass/**/*.scss",
  stylesDest: "public/assets/css",
  srcPages: "src/pages/**/*.ejs", // Change file extension to .ejs
  jsSrc: "src/assets/js/**/*.js",
  assetsSrc: "src/assets/**/*",
  partialsDir: "src/pages/partials/**/*.ejs",
  publicDir: "public",
  publicAssetsDir: "public/assets",
};

async function compileHTML() {
  return gulp
    .src([paths.srcPages, `!${paths.partialsDir}`]) // Change source to .ejs files
    .pipe(ejs({}))
    .pipe(replaceAssetsPath())
    .pipe(rename({ extname: ".html" })) // Rename file extension to .html
    .pipe(prettier(prettierConfig))
    .pipe(gulp.dest(paths.publicDir));
}

function replaceAssetsPath() {
  return new Transform({
    objectMode: true,
    transform(file, encoding, callback) {
      if (file.isNull()) {
        // Pass through null files
        this.push(file);
        return callback();
      }

      if (file.isStream()) {
        // Emit error if file is a stream (which is not supported)
        this.emit("error", new Error("Streaming not supported"));
        return callback();
      }

      if (file.isBuffer()) {
        // Perform the replacement on file buffer
        let contents = file.contents.toString(encoding);

        // Define regex pattern to match paths containing "assets/"
        const regex = /(["'])(.*?\/assets\/)(.*?)(["'])/g;

        // Replace paths containing "assets/" with the simplified version
        contents = contents.replace(regex, (match, p1, p2, p3) => {
          console.log({ p1, p2, p3 });
          return `${p1}assets/${p3}${p1}`;
        });

        file.contents = Buffer.from(contents, encoding);
      }

      this.push(file);
      callback();
    },
  });
}

async function cleanPublic() {
  try {
    await fs.access(paths.publicDir, constants.R_OK | constants.W_OK);
    await fs.rm(paths.publicDir, { recursive: true });
  } catch (err) {}
  await fs.mkdir(paths.publicAssetsDir, { recursive: true });
}

function copyAssets() {
  return gulp
    .src(paths.assetsSrc)
    .pipe(gulp.dest(path.join(paths.publicDir, "assets")));
}

function serveFiles() {
  browserSync.init({
    server: {
      baseDir: paths.publicDir,
    },
  });

  gulp
    .watch(paths.stylesSrc, gulp.series(compileStyles))
    .on("change", browserSync.reload);
  gulp
    .watch(paths.srcPages, gulp.series(compileHTML))
    .on("change", browserSync.reload);
  gulp.watch(paths.assetsSrc, copyAssets).on("change", browserSync.reload);
  gulp.watch(paths.jsSrc).on("change", browserSync.reload);
}

function watchAndCompile() {
  gulp.watch(paths.stylesSrc, compileStyles);
  gulp.watch(paths.srcPages, compileHTML);
  gulp.watch(paths.assetsSrc, copyAssets);
}

function compileStyles() {
  return gulp
    .src(paths.stylesSrc)
    .pipe(sass().on("error", sass.logError))
    .pipe(postcss())
    .pipe(gulp.dest(paths.stylesDest))
    .pipe(cleanCSS())
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest(paths.stylesDest));
}

const build = gulp.series(
  cleanPublic,
  gulp.parallel(compileStyles, compileHTML, copyAssets),
);
const watch = gulp.series(build, gulp.parallel(serveFiles, watchAndCompile));

export {
  compileStyles,
  compileHTML,
  copyAssets,
  cleanPublic,
  build,
  watch,
  serveFiles as serve,
};

export default build;
