# Eionet webform generator

_Note: this tool is not considered finished nor used in production, and the instructions below are untested._

## Installation

1. Clone this repository
2. Install Node JS & NPM if not already installed
3. Install nodemon (`npm install -g nodemon`) if not already installed
4. Install babel cli (`npm install -g babel-cli`) if not already installed
5. Run `npm install` in the cloned project folder to install all dependencies

## Usage

Examine the examples in [/test](./test) and build them using this command

`nodemon ./src/xsdwebform.js --exec babel-node --presets es2015,stage-2 -f ./test/dstypes`

where _"./test/dstypes"_ is the path and name of the webform to generate. 

The result will be put in `/build`.

## Further information

See [/src/client/dev/readme.md](/src/client/dev/readme.md) for further information on how to use the generated webform project.
