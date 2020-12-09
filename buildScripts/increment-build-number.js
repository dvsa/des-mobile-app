#!/usr/bin/env node
// Updates Cordova config.xml with a semver compatible version.
// The new version takes whatever is in the release branch, e.g.
// a branch named "release-3.1.2" will yield the version "3.1.2"

const branchName = require('current-git-branch')();
const semver = require('semver');

var fs = require('fs');
var xml2js = require('xml2js');

const configFile = 'config.xml';

// Read config.xml
fs.readFile(configFile, 'utf8', (err, xml) => {

  if (err) {
    return console.error(err);
  }

  if (!branchName) return console.error('Not a git repository');

  if (branchName.indexOf('release') < 0) {
    return;
  }

  // Parse XML to JS Obj
  xml2js.parseString(xml, (err, obj) => {
    if (err) {
      return console.error(err);
    }

    const newVersion = branchName.substring(branchName.indexOf('-') + 1, branchName.length);
    const isSemver = semver.valid(newVersion);

    if (isSemver == null) {
      return console.error('Invalid semantic version format in release branch name, needs to be like \"release-3.1.2\"');
    }

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
