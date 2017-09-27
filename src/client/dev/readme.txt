# How to use the generated (built) webform

## Setup

Navigate to the `build\dev` directory and install the dependencies using `npm install`.

## Linting

Do a code linting test by running `npm run lint`

## Accessibility test

Do a WCAG-2 accessibility test by 

- Edit the _URL_TO_TEST_ variable in test.js
- Run `npm test`

## Build files

To re-build the webform, run `npm run build` and look in the directory dev/dist for minified versions of [webFormName].webform.js and [webFormName].webform.css

## Build minified files
To re-build the webform as minified files, run `npm run deploy`, which overwrites [webFormName].webform.min.js and [webFormName].webform.min.css

## Repackage all included components
---------------------------------
Run `npm run buildall` and look in the directory dev/dist for minified versions of [webFormName].webform.js and [webFormName].webform.css and in dev/dist/assets for components

