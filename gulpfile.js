'use strict'

/* **************************************************
 *
 * require packages
 *
 * **************************************************/
// general modules
const gulp = require('gulp')
const sourcemaps = require('gulp-sourcemaps')

// sass postcss modules
const sass = require('gulp-sass')
const packageImporter = require('node-sass-package-importer')
const postcss = require('gulp-postcss')
const autoprefixer = require('autoprefixer')
const cssMqPacker = require('css-mqpacker')
const flexBugsFixes = require('postcss-flexbugs-fixes')
const cssWring = require('csswring')

// clean modules
const clean = require('del')

// server modules
const server = require('browser-sync').create()

/* **************************************************
 *
 * general setting
 *
 * **************************************************/
const documentRoot = `${__dirname}`
const srcRoot = `${documentRoot}/src`
const distRoot = `${documentRoot}/dist`

/* **************************************************
 *
 * sass
 *
 * **************************************************/
const sassConfig = {
  sassOption: {
    outputStyle: 'expanded',
    importer: packageImporter({
      extensions: ['.scss', '.css'],
    }),
  },
  autoprefixerOption: { grid: true },
  postcssOption: [
    cssMqPacker,
    flexBugsFixes,
    autoprefixer(this.autoprefixerOption),
  ],
  postcssOptionRelease: [
    cssMqPacker,
    flexBugsFixes,
    autoprefixer(this.autoprefixerOption),
    cssWring,
  ],
}

gulp.task('sass:dev', () => {
  return gulp.src(`${srcRoot}/**/*.scss`)
    .pipe(sourcemaps.init())
    .pipe(sass(sassConfig.sassOption))
    .pipe(postcss(sassConfig.postcssOption))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(`${distRoot}/`))
})

gulp.task('sass:build', () => {
  return gulp.src(`${srcRoot}/**/*.scss`)
    .pipe(sass(sassConfig.sassOption))
    .pipe(postcss(sassConfig.postcssOptionRelease))
    .pipe(gulp.dest(`${distRoot}/`))
})


/* **************************************************
 *
 * clean
 *
 * **************************************************/
gulp.task('clean', (callback) => {
  clean([`${distRoot}/**`, `!${distRoot}`], callback())
})

/* **************************************************
 *
 * server
 *
 * **************************************************/
const serverConfig = {
  server: {
    baseDir: `${distRoot}`,
  },
  browser: []
}

gulp.task('server', (callback) => {
  server.init(serverConfig)
  callback()
})

/* **************************************************
 *
 * watch
 *
 * **************************************************/
gulp.task('watch', gulp.series('server', () => {
  const reload = (callback) => {
    server.reload()
    callback()
  }

  gulp.watch(`${srcRoot}/**/*.scss`, gulp.task('sass:dev'))
  gulp.watch(`${distRoot}/**/*`, reload)
}))

/* **************************************************
 *
 * build
 *
 * **************************************************/
gulp.task(
  'build',
  gulp.series('clean', gulp.parallel('sass:build'))
)

/* **************************************************
 *
 * default
 *
 * **************************************************/
gulp.task('default', gulp.parallel('watch'))
