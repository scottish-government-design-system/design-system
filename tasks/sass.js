const sass = require('sass');
const fs = require('fs');
const mkdirp = require('mkdirp');
const getDirName = require('path').dirname;
const argv = require('minimist')(process.argv.slice(2));

function compileSass(options = {}) {
    // set default options
    options = Object.assign({
        style: 'compressed'
    }, options);

    // render the result
    var result = sass.renderSync({
        file: options.src,
        outputStyle: options.style
    });

    // write the result to file
    mkdirp(getDirName(options.dest), function () {
        fs.writeFile(options.dest, result.css, function (error) {
            if (error) {
                console.log(error)
            } else {
                // log successful compilation
                console.log('\x1b[32m%s\x1b[0m', options.dest + ' built');
            }
        });
    });
};

if (argv.d) {
    // dev version
    compileSass({
        src : 'src/pattern-library.scss',
        dest: 'dev/assets/css/pattern-library.css',
        style: 'expanded'
    });
} else {
    // production/dist version
    compileSass({
        src : 'src/pattern-library.scss',
        dest: 'dist/css/pattern-library.css'
    });
}
