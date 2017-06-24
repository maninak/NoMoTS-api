const gulp        = require('gulp'),
      clean       = require('gulp-clean'),
      gulpCopy    = require('gulp-copy'),
      ts          = require('gulp-typescript'),
      sourcemaps  = require('gulp-sourcemaps'),
      nodemon     = require('gulp-nodemon'),
      tslint      = require("gulp-tslint"),
      mocha       = require('gulp-mocha'),
      env         = require('gulp-env');


gulp.task('clean', () => {
  return gulp.src('dist', { read: false })
    .pipe(clean());
});

gulp.task('clean-node', () => {
  return gulp.src('node_modules', { read: false })
    .pipe(clean());
});

gulp.task('copy', ['clean'], () => {
  return gulp.src([ 'src/assets/**/*' ])
    .pipe(gulpCopy('dist'));
});

gulp.task('build', ['clean', 'copy'], () => {
  const tsconfig = ts.createProject('tsconfig.json');
  const tsResult = tsconfig.src()
    .pipe(tsconfig());
  return tsResult.js.pipe(gulp.dest('dist'));
});

gulp.task('build-dev', ['clean', 'copy'], () => {
  const tsconfig = ts.createProject('tsconfig.json');
  const tsResult = tsconfig.src()
    .pipe(sourcemaps.init())
    .pipe(tsconfig());
  return tsResult.js
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('dist'));
});

gulp.task('test', ['build'], () => {
  const envs = env.set({ NODE_ENV: 'test' });
  return gulp.src('dist/test/**/*.test.js', { read: false })
    .pipe(mocha({
      reporter: 'dot',
      timeout: 500,
    }))
    .once('error', () => { process.exit(1); })
    .once('end', () => { process.exit(); });
});

gulp.task('test-dev', ['build-dev'], () => {
  const envs = env.set({ NODE_ENV: 'test' });
  return gulp.src('dist/test/**/*.test.js', { read: false })
    .pipe(mocha({
      reporter: 'dot',
      timeout: 500,
    }));
});

gulp.task("tslint", () => {
  gulp.src([
      'src/**/*.ts',
      'test/**/*.test.ts'
    ])
    .pipe(tslint({
        formatter: "prose"
    }))
    .pipe(tslint.report({
      emitError: false,
      reportLimit: 5,
    }));
});

gulp.task('watch', ['build-dev'], () => {
  gulp.watch(
    ['src/**/*.ts', 'test/**/*.test.ts'],
    ['build-dev', 'tslint', 'test-dev']
  );
});

gulp.task('demon', () => {
  nodemon({
    script: 'dist/src/index.js',
    watch: '**/dist/**/*',
    ext: 'js',
    env: { DEBUG: 'prn-*' },
    delay: 100
  });
});
