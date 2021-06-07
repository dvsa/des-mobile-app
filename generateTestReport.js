var fs = require('fs');
var xml2js = require('xml2js');
var reporter = require('cucumber-html-reporter');

var parser = new xml2js.Parser();
let xml_string = fs.readFileSync('config.xml', 'utf8');
var appVersion = '1.0.0';
parser.parseString(xml_string, (err, result) => {
  appVersion = result['widget'].$.version;
});

let e2eTestConfig = fs.readFileSync('test-reports/e2e-test-config.json');
let e2eConfig = JSON.parse(e2eTestConfig);

let metaDataContent = {};
metaDataContent['App Version'] = appVersion;
metaDataContent['Platform Name'] = e2eConfig.capabilities.platformName;
metaDataContent['Platform Version'] = e2eConfig.capabilities.platformVersion;
metaDataContent['Device Name'] = e2eConfig.capabilities.deviceName;
metaDataContent['Date'] = new Date();
metaDataContent['Tags'] = (e2eConfig.cucumberOpts.tags == undefined) ? 'Not specified' : e2eConfig.cucumberOpts.tags;

let features = '<br/>';
e2eConfig.specs.forEach((spec) => {
  features = features + spec.substr(spec.indexOf('/test/'), spec.length) + '<br/>';
});
metaDataContent['Feature Files'] = features;

var options = {
  theme: 'bootstrap',
  jsonFile: 'test-reports/cucumber-report.json',
  output: 'test-reports/cucumber-report.html',
  reportSuiteAsScenarios: true,
  launchReport: false,
  metadata: metaDataContent
};

reporter.generate(options);
