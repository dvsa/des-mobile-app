#!/usr/bin/env node
// Used to put the version number + git SHA into the filename of the IPA artifact

var fs = require('fs');
var git = require('git-rev-sync');
var xml2js = require('xml2js');

const configFile = 'config.xml';

// Read config.xml
fs.readFile(configFile, 'utf8', (err, xml) => {
  if (err) {
    return console.console.error(err);
  }

  // Parse XML to JS Obj
  xml2js.parseString(xml, (err, obj) => {
    if (err) {
      return console.error(err);
    }

    const currentVersion = obj.widget['$'].version;
    const artifactDir = 'build';
    const defaultArtifactName = 'DrivingExaminerService.ipa';
    const newArtifactName = `DrivingExaminerService-${currentVersion}-${Math.floor(Date.now() / 1000)}-${git.short()}.ipa`;

    const oldArtifactPath = `${artifactDir}/${defaultArtifactName}`;
    const newArtifactPath = `${artifactDir}/${newArtifactName}`;

    if (fs.existsSync(oldArtifactPath)) {
      fs.renameSync(oldArtifactPath, newArtifactPath);
      console.log(`IPA artifact rename: ${oldArtifactPath} => ${newArtifactPath}`);
    } else {
      console.log(`Couldn't find artifact '${oldArtifactPath}' - skipping IPA rename`);
    }
  });
});
