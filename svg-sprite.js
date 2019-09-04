'use strict';

let SVGSpriter = require('svg-sprite');
let path = require('path');
let mkdirp = require('mkdirp');
let fs = require('fs');
let File = require('vinyl');
let glob = require('glob');

let destpath = path.resolve('dist/images/icons/');

let config = {
    "log": "",
    "shape": {
        "id": {
           "separator": ""
        }
    },
    "mode": {
        "stack": {
            "dest": destpath,
            "sprite": "icons.stack.svg"
        }
    }
};

let spriter = new SVGSpriter(config);

// Register some SVG files with the spriter
let cwd = path.resolve('images/icons/svg/');
glob.glob('**/*.svg', { cwd: cwd }, function (err, files) {
    files.forEach(function (file, index) {
        spriter.add(new File({
            path: path.join(cwd, file),
            base: cwd,
            contents: fs.readFileSync(path.join(cwd, file))
        }));
    });

    // Compile the sprite
    spriter.compile(function(error, result, cssData) {
        // Run through all configured output modes
        for (var mode in result) {
            // Run through all created resources and write them to disk
            for (var type in result[mode]) {
                mkdirp.sync(path.dirname(result[mode][type].path));
                fs.writeFileSync(result[mode][type].path, result[mode][type].contents);
            }
        }
    });
});
