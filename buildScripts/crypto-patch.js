// const fs = require('fs');
//
// const path = 'node_modules/@angular-devkit/build-angular/src/angular-cli-files/models/webpack-configs/browser.js';
//
// // post install script for updating the browser.js file with crypto allow config, needed for creating hashes with GA
// fs.readFile(path, 'utf8', (err, data) => {
//   if (err) {
//     return console.log(err);
//   }
//   const result = data.replace(/node: false/g, 'node: {crypto: true, stream: true}');
//
//   fs.writeFile(path, result, 'utf8', (error) => {
//     if (error) return console.log(error);
//   });
// });
