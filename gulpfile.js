const { src, dest, watch, series, parallel } = require('gulp'),
    mode = require('gulp-mode')(),
    server = require('browser-sync').create(),
    sass = require('gulp-sass'),
    sassLint = require('gulp-sass-lint'),
    autoPrefixer = require('gulp-autoprefixer'),
    sourcemaps = require('gulp-sourcemaps'),
    plumber = require('gulp-plumber'),
    uglify = require('gulp-uglify'),
    kit = require('gulp-kit'),
    notify = require('gulp-notify'),
    babel = require('gulp-babel'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    jsHint = require('gulp-jshint'),
    jsHintStylish = require('jshint-stylish'),
    prettyHTML = require('gulp-pretty-html'),
    htmlMin = require('gulp-htmlmin'),
    rtlCSS = require('gulp-rtlcss'),
    gulpIf = require('gulp-if'),
    imageMin = require('gulp-imagemin'),
    gUtil = require('gulp-util'),

    // SASS options
    sassOptions = {
        errLogToConsole: true,
        outputStyle: 'compressed'
    },

    // JS options
    jsOptions = {
        mangle: false
    },

    // KIT options
    kitOptions = {
        compilePartials: false
    },

    // HTML Options
    prettyHTMLOptions = {
        indent_size: 4,
        indent_char: ' ',
        indent_inner_html: false,
        wrap_attributes: "auto"
    },

    // HTML Min Options
    HTMLMinOptions = {
        collapseWhitespace: true
    },

    // rtlCSS Options
    rtlCSSOptions = {
        suffix: "-rtl"
    };

// Check if current mode is production as boolean
const isProduction = mode.production();

// Check if the outputted CSS file will have a RTL version or no
const isRTL = gUtil.env.dir === "rtl";

// Set the production and development folders
const folder = isProduction ? 'public' : 'publicDev';

// Define paths of source files and build directories
const paths = {
    js: ['src/js/**/!(app)*.js', 'src/js/app.js'], // JS files source - placing the last file as app.js which contains custom JS code
    jsBuild: folder + '/assets/js/', // JS build directory
    styles: 'src/scss/**/*.scss', // SASS files source
    stylesBuild: folder + '/assets/css/', // SASS build directory
    kit: 'src/kit/**/*.kit', // KIT files source
    kitBuild: folder + '/', // KIT build directory
    fonts: ['src/fonts/**/*', '!src/fonts/**/.gitkeep'], // Fonts files source
    fontsPublic: folder + '/assets/fonts/', // Fonts destination directory
    images: ['src/images/**/*', '!src/images/**/.gitkeep'], // Images files source
    imagesPublic: folder + '/assets/images/', // Images destination directory
};

// Init browserSync server
function browserSyncFn(done) {
    server.init({
        injectChanges: true,
        server: {
            baseDir: folder === undefined ? "src" : folder + "/",
            directory: true,
            notify: false
        }
    });
    done();
}

// Compile KIT files to html
function buildKitFiles() {
    return src(paths.kit)
        .pipe(plumbError())
        .pipe(kit(kitOptions))
        .pipe(mode.development(prettyHTML(prettyHTMLOptions)))
        .pipe(isProduction ? htmlMin(HTMLMinOptions) : gUtil.noop())
        .pipe(dest(paths.kitBuild))
        .on("end", server.reload)
        .pipe(notify({
            "message": "KIT Files Compiled!",
            "onLast": true
        }));
}

// Compile SASS files to CSS with auto prefixed styles and with sourcemap files
function buildStyles() {
    return src(paths.styles)
        .pipe(plumbError())
        .pipe(mode.development(sourcemaps.init()))
        .pipe(sass(sassOptions))
        .pipe(autoPrefixer())
        .pipe(mode.development(sourcemaps.write('/')))
        .pipe(dest(paths.stylesBuild)) // Output LTR stylesheets.
        .pipe(isRTL ? gulpIf('*.css', rtlCSS()) : gUtil.noop()) // Convert to RTL.
        .pipe(isRTL ? gulpIf('*.css', rename({ suffix: rtlCSSOptions.suffix })) : gUtil.noop()) // Append suffix to the filename.
        .pipe(isRTL ? mode.development(gulpIf('*.css', sourcemaps.write('/'))) : gUtil.noop()) // Output source maps.
        .pipe(isRTL ? dest(paths.stylesBuild) : gUtil.noop()) // Output RTL stylesheets.
        .pipe(server.reload({
            stream: true
        }))
        .pipe(notify({
            "message": "SCSS Compiling Completed!",
            "onLast": true
        }));
}

/*
    Concat, rename, uglify and export all files into one file.
    If you want to compile js files in custom order, add a number suffix to each file name inside the "/src/js/libs" folder with the order you want,
    e.g. (01.jquery.min.js, 02.bootstrap.min.js, ....)
*/
function buildJS() {
    return src(paths.js)
        .pipe(plumbError())
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(concat('app.js'))
        .pipe(mode.development(dest(paths.jsBuild)))
        .pipe(rename('app.min.js'))
        .pipe(uglify(jsOptions))
        .pipe(dest(paths.jsBuild))
        .pipe(server.stream())
        .pipe(notify({
            "message": "JS Uglify Completed!",
            "onLast": true
        }));
}

// Copy fronts from the src folder to the assets public folder
function copyFonts() {
    return src(paths.fonts)
        .pipe(dest(paths.fontsPublic))
        .pipe(notify({
            "message": "Fonts copied to the assets public folder!",
            "onLast": true
        }));
}

// Minify images in the src folder and copy the minified images to the assets public folder
function minifyImages() {
    return src(paths.images)
        .pipe(imageMin([
            imageMin.gifsicle({ interlaced: true }),
            imageMin.jpegtran({ progressive: true }),
            imageMin.optipng({ optimizationLevel: 5 }),
            imageMin.svgo({
                plugins: [
                    { removeViewBox: true },
                    { cleanupIDs: false }
                ]
            })
        ], { verbose: true }))
        .pipe(dest(paths.imagesPublic))
        .pipe(notify({
            "message": "Images minified and copied to the assets public folder!",
            "onLast": true
        }));
}

// Check SASS errors and enhancements before compiling
function checkSassErrors() {
    return src(paths.styles)
        .pipe(plumbError())
        .pipe(sassLint({
            options: {
                formatter: 'stylish',
                'merge-default-rules': false
            }
        }))
        .pipe(sassLint.format())
        .pipe(sassLint.failOnError())
}

// Check JS error and enhancements before compiling
function checkJsErrors() {
    return src('src/js/app.js')
        .pipe(plumbError())
        .pipe(jsHint({
            esversion: 6 // Define the JavaScript version to use in the project
        }))
        .pipe(jsHint.reporter(jsHintStylish))
}

// Watch SASS files changes then check SASS errors and finally compile files to CSS with auto prefixed styles and with sourcemaps files
function watchStyleFiles() {
    watch(
        paths.styles,
        {
            events: 'all',
            ignoreInitial: false
        },
        series(checkSassErrors, buildStyles)
    );
}

// Watch JS files changes then check JS errors, concat files, rename files and finally uglify the output JS file
function watchJsFiles() {
    watch(
        paths.js,
        {
            events: 'all',
            ignoreInitial: false
        },
        series(checkJsErrors, buildJS)
    );
}

// Watch Kit files changes and build them to HTML
function watchKitFiles() {
    watch(
        paths.kit,
        {
            events: 'all',
            ignoreInitial: false
        },
        series(buildKitFiles)
    );
}

// Watch font files changes and copy them to the assets public folder
function watchFontsFiles() {
    watch(
        paths.fonts,
        {
            events: 'all',
            ignoreInitial: false
        },
        series(copyFonts)
    );
}

// Watch images files changes, minify them and finally copy them to the assets public folder
function watchImagesFiles() {
    watch(
        paths.images,
        {
            events: 'all',
            ignoreInitial: false
        },
        series(minifyImages)
    );
}

// Global Error Handler
function plumbError() {
    return plumber({
        errorHandler: function (error) {
            notify.onError({
                templateOptions: {
                    date: new Date()
                },
                title: 'Compiling error with "' + error.plugin + '"',
                message: error.formatted
            })(error);

            // Keep gulp from hanging on this task
            this.emit('end');
        }
    })
}

/*
    Default functions to run with running gulp
    1. Run the browserSync server to serve files from the "public/" folder
    2. Run SASS files watch command to check for SASS errors and finally create source map files with CSS files
    3. Run JS files watch command to check JS errors and finally concat, rename, uglify and export all files into one file
    4. Run KIT files watch command to compile KIT files into HTML
    5. Run Images files minify command to minify images files and copy them to the assets public folder
    6. Run Fonts files copy command to copy fonts files to the assets public folder
*/
const parallelCommands = isProduction ?
    parallel(buildStyles, buildJS, buildKitFiles, minifyImages, copyFonts) :
    parallel(browserSyncFn, watchStyleFiles, watchJsFiles, watchKitFiles, minifyImages, copyFonts);
exports.default = parallelCommands;

/*
    Build commands with gulp
    1. Build SASS files: gulp buildStyles
    2. Build JS files: gulp buildJS
    3. Build Kit files: gulp buildKitFiles
    4. Minify Images: gulp minifyImages
    5. Copy Fonts files: gulp copyFonts
*/
exports.buildStyles = buildStyles;
exports.buildJS = buildJS;
exports.buildKitFiles = buildKitFiles;
exports.minifyImages = minifyImages;
exports.copyFonts = copyFonts;

/*
    Watch commands with gulp
    1. Watch SASS files: gulp watchStyleFiles
    2. Watch JS files: gulp watchJsFiles
    3. Watch Kit files: gulp watchKitFiles
    4. Watch Images files: gulp watchImagesFiles
    5. Watch Fonts files: gulp watchFontsFiles
*/
exports.watchStyleFiles = watchStyleFiles;
exports.watchJsFiles = watchJsFiles;
exports.watchKitFiles = watchKitFiles;
exports.watchImagesFiles = watchImagesFiles;
exports.watchFontsFiles = watchFontsFiles;