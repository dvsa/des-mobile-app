const fs = require('fs');
const xml2js = require('xml2js');

const configFile = 'config.xml';
// const test = process.env.npm_config_argv;
// console.log('test', JSON.parse(process.env.npm_config_argv).remain[0]);
// console.log('process.env', process.env.npm_config_argv);

const newVersion = JSON.parse(process.env.npm_config_argv).remain[0];

// Read config.xml
fs.readFile(configFile, 'utf8', (err, xml) => {

  if (err) {
    return console.error(err);
  }

  // Parse XML to JS Obj
  xml2js.parseString(xml, (err, obj) => {
    if (err) {
      return console.error(err);
    }

    // const newVersion = '4.4.4.5';

    obj.widget['$'].version = newVersion;

    var builder = new xml2js.Builder();
    var xml = builder.buildObject(obj);

    fs.writeFile(configFile, xml, (err) => {
      if (err) {
        return console.error(err);
      }
      console.log(`Build number successfully incremented to ${newVersion}`);
    });
  });
});
