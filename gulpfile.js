var gulp = require('gulp'),
    less = require('gulp-less'), //less编译css文
    imagemin = require('gulp-imagemin'),//压缩图片
	clean = require('gulp-clean'), //清理
    runSequence = require('run-sequence'); //顺序执行任务
// 样式 
gulp.task('testLess', function() {
    gulp.src('src/less/*.less')
        .pipe(less())
        .pipe(gulp.dest('dist/css'));
});
// 脚本
gulp.task('scripts', function() {
    gulp.src(['src/js/lib/*.js'])
        .pipe(gulp.dest('dist/js/lib'));
    gulp.src(['src/js/*.js'])
        .pipe(gulp.dest('dist/js'));
});
// Images
gulp.task('images', function() {
    gulp.src('src/images/*.png')
    .pipe(imagemin({
            optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
            progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
            interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
            multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
        }))
    .pipe(gulp.dest('dist/images'));
});
//html
gulp.task('html', function() {
    gulp.src('src/*.html')
        .pipe(gulp.dest('dist/'));
});
// 清理
gulp.task('clean', function() {
    return gulp.src(['dist/css', 'dist/js','dist/images'], { read: false })
        .pipe(clean());
});
// 预设任务
gulp.task('default', function(callback) {
    runSequence('clean', 'testLess', 'scripts', 'images','html', callback);
});
