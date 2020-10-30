#!/bin/bash
git reset --hard
git clean -f -d 

npm uninstall @ngrx/schematics
npm uninstall @ngrx/{store,effects,store-devtools}

ng config cli.defaultCollection @ionic/angular-toolkit
