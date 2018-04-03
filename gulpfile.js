var gulp 		= require("gulp");
var sass 		= require("gulp-sass");
var browserSync = require("browser-sync").create();
var useref		= require("gulp-useref");
var uglify		= require("gulp-uglify");
var gulpIf		= require("gulp-if");
var cssnano		= require("gulp-cssnano");
var del 		= require("del");
var runSequence	= require("run-sequence");
var rename		= require("gulp-rename");
var htmlbeautify = require("gulp-html-beautify");
var nunjucksRender = require('gulp-nunjucks-render');

// Basic Gulp task syntax
// gulp.task("task-name", function() {
//     console.log("Kamal")
// });

gulp.task('htmlbeautify', function() {
  	var options = {
    	indentSize: 4,
        preserve_newlines: false,
  	};
  	gulp.src('dist/*.html')
    	.pipe(htmlbeautify(options))
    	.pipe(gulp.dest('dist/'))
});

// Start browserSync
gulp.task('browserSync', function() {
    browserSync.init({
    	server: {
    		baseDir: 'dist'
    	}
    })
});

// Nunjucks render
gulp.task('nunjucks', function() {
    // Gets .html and .nunjucks files in pages
    return gulp.src('source/templates/pages/**/*.+(html|nunjucks)')
        // Renders template with nunjucks
        .pipe(nunjucksRender({
            path: ['source/templates']
        }))
        // output files in app folder
        .pipe(gulp.dest('dist/'))
        .pipe(browserSync.stream())
});

// Sass
gulp.task('sass', function() {
    return gulp.src("source/scss/**/*.scss")
    	.pipe(sass())
    	.pipe(gulp.dest('dist/css'))
    	.pipe(browserSync.reload({
    		stream: true
    	}))
});

// Watchers
gulp.task('watch', function() {
	gulp.watch("source/scss/**/*.scss", ["sass"]);
    gulp.watch("source/templates/**/*.nunjucks", ["nunjucks"]);
    gulp.watch("dist/*.html", browserSync.reload);
	gulp.watch("dist/js/**/*.js", browserSync.reload);
});

// Copying Fonts
gulp.task('fonts', function() {
	return gulp.src('source/fonts/**/*')
		.pipe(gulp.dest('dist/fonts'))
});

gulp.task('js', function() {
	return gulp.src('source/js/**/*')
		.pipe(gulp.dest('dist/js'))
});

// Cleaning
// gulp.task('clean:dist', function() {
//     return del.sync('dist/');
//     return del.sync(['dist/**/*', '!dist/images', '!dist/images/**/*']);
// });

// Build Sequence
// ======================================

// Default
gulp.task('default', function(callback) {
    runSequence([
        'nunjucks',
    	'sass',
    	'browserSync'], 'watch',
    	callback
    )
});

// Production
gulp.task('build', function() {
    runSequence(
    	['sass', 'fonts', 'htmlbeautify']
    )
});