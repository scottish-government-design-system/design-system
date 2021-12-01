'use strict';

/* Create a new Fractal instance and export it for use elsewhere if required */
const fractal = module.exports = require('@frctl/fractal').create();
const nunj = require("@frctl/nunjucks")({
  paths: ["public"]
});

const mandelbrot = require('@frctl/mandelbrot');

const dsTheme = mandelbrot({
    skin: {
        name: 'white',
        links: '#0065bd',
        complement: '#fff',
        accent: '#0065bd'
    }
});

fractal.web.theme(dsTheme);

/* Set the title of the project and include the version number */
fractal.set('project.title', 'Scottish Government Pattern Library');

fractal.components.engine(nunj); // register the Nunjucks adapter for your components
fractal.components.set("ext", ".njk"); // look for files with a .njk file extension
/* Tell Fractal where the components will live */
fractal.components.set('path', __dirname + '/src');


fractal.components.set('statuses', {
    invalid: {
        label: "Invalid",
        description: "Invalid. Do not implement.",
        color: "#d32205"
    },
    wip: {
        label: "WIP",
        description: "Work in progress. Do not implement.",
        color: "#d32205"
    },
    prototype: {
        label: "Prototype",
        description: "Implement with caution.",
        color: "#f47738"
    },
    ready: {
        label: "Ready",
        description: "Ready to implement.",
        color: "#428542"
    }
});

fractal.docs.set('statuses', {
    wip: {
        label: 'WIP',
        description: 'Work in progress.',
        color: '#d32205'
    },
    ready: {
        label: 'Ready',
        description: 'Ready for referencing.',
        color: '#428542'
    }
});


/* Tell Fractal where the documentation pages will live */
fractal.docs.set('path', __dirname + '/src/docs');

/* Location for static assets */
fractal.web.set('static.path', __dirname + '/dev');

/* Location for build */
fractal.web.set('builder.dest', __dirname + '/export');
