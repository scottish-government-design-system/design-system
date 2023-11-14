# Scottish Government Design System

This repository contains all the code needed to start building user interfaces for websites and web applications for the Scottish Government and other Scottish public sector bodies.

See live examples of the available components, alongside guidance on how and when to use them in the [Scottish Government Design System](https://designsystem.gov.scot/).

## Feedback, help or support

If you need any help or want to give any feedback you can e-mail the Design System team at: [designsystem@gov.scot](mailto:designsystem@gov.scot).

## How to use in your project

We recommend [installing the package using node package manager (npm)](https://designsystem.gov.scot/get-started/installation/).

### Install

To install your own local copy of the package follow these steps:

1. Ensure you have [node.js](https://nodejs.org/en/) installed. We recommend using the latest Long Term Support (LTS) version, or a minimum of version 8.10.0.
2. Run the command `npm install @scottish-government/design-system` in your chosen directory. This will install the project and its dependencies.

### Run tasks

Once installed the following tasks can be run:

#### Build production files

These are the optimised CSS, JavaScript files and static assets that should be included in your project.

Run:

```
npm run prepack
```

This will compile the various files and conduct a series of automated tests and update the contents of the `/dist` directory with the newly generated files.
