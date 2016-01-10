const gulp = require('gulp')
const gutil = require('gulp-util')
const eslint = require('gulp-eslint')
const nodemon = require('gulp-nodemon')

gulp.task('lint', () => {
  return gulp.src(['**/*.js', '!node_modules/**'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
})

gulp.task('default', () => {
  gutil.log(gutil.colors.yellow('Running nodemon'))
  require('dotenv').load()
  return nodemon({
    exec: 'node --es_staging',
    script: 'index.js',
    tasks: ['lint'],
    verbose: true
  })
})
