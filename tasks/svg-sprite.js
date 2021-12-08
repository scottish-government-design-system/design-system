'use strict';

const SVGSpriter = require('svg-sprite');
const path = require('path');
const mkdirp = require('mkdirp');
const fs = require('fs');
const File = require('vinyl');
const glob = require('glob');
const argv = require('minimist')(process.argv.slice(2));

const filename = "icons.stack.svg";
let destpath;

if (argv.d) {
    destpath = 'dev/assets/images/icons/';
} else {
    destpath = 'dist/images/icons/';
}

const config = {
    "log": "",
    "shape": {
        "id": {
           "separator": ""
        }
    },
    "mode": {
        "stack": {
            "dest": destpath,
            "sprite": filename
        }
    }
};

const spritePaths = [
    'src/images/icons/svg/'
];

const spriter = new SVGSpriter(config);

spritePaths.forEach(spritePath => {
    const cwd = path.resolve(spritePath);

    // Register some SVG files with the spriter
    glob.sync('**/*.svg', { cwd: cwd }).forEach(function (file, index) {
        spriter.add(new File({
            path: path.join(cwd, file),
            base: cwd,
            contents: fs.readFileSync(path.join(cwd, file))
        }));
    });
});

// Compile the sprite
spriter.compile(function(error, result, cssData) {
    // Run through all configured output modes
    for (var mode in result) {
        // Run through all created resources and write them to disk
        for (var type in result[mode]) {
            mkdirp.sync(path.dirname(result[mode][type].path));
            fs.writeFileSync(result[mode][type].path, result[mode][type].contents);

            // log successful compilation
            console.log('\x1b[32m%s\x1b[0m', `${destpath}${filename} built`);
        }
    }
});
