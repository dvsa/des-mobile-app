#!/bin/bash

npm install @ngrx/schematics --save-dev
npm install @ngrx/{store,effects,store-devtools} --save

ng config cli.defaultCollection @ngrx/schematics
