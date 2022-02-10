# Digital Scotland Design System Pattern Library

This pattern library contains all the code needed to start building user interfaces for websites and web applications for the Scottish Government and other Scottish public sector bodies.

See live examples of the available components, alongside guidance on how and when to use them in the [Digital Scotland Design System](https://designsystem.gov.scot/).

## Feedback, help or support

If you need any help or want to give any feedback you can e-mail the Design System team at: [designsystem@gov.scot](mailto:designsystem@gov.scot).

## How to use in your project

We recommend [installing the pattern library using node package manager (npm)](https://designsystem.gov.scot/get-started/installation/).

## Run the pattern library locally

The pattern library uses [Fractal](https://fractal.build/), to display components and their variants, which simplifies development and testing.

### Install

To install your own local copy of the pattern library follow these steps:

1. Ensure you have [node.js](https://nodejs.org/en/) installed. We recommend using the latest Long Term Support (LTS) version, or a minimum of version 8.10.0.
2. Run the command `npm install @scottish-government/pattern-library` in your chosen directory. This will install the project and its dependencies.

### Run tasks

Once installed the following tasks can be run:

#### Build development files

These are the CSS, JavaScript files and static assets that Fractal references to present the various components.

Run:

```
npm run dev
```

This will compile the various files and conduct a series of automated tests before updating the contents of the `/dev` directory with the newly generated files.

#### View the pattern library

This launches Fractal to let you browse the components at the specified local URL.

Run:

```
npm run fractal
```

This will start a new instance of Fractal on a local URL which will be specified in the terminal. This task remains running in the background as any new changes to Fractal config files will then automatically be updated in the browser.

#### Build production files

These are the optimised CSS, JavaScript files and static assets that should be included in your project.

Run:

```
npm run prepublish
```

This will compile the various files and conduct a series of automated tests before updating the contents of the `/dist` directory with the newly generated files.