#!/usr/bin/env node
// Syncs the package.json, config.xml and Capacitor Info.plist versions
// package.json is the master version number

const plist = require('plist');
const fs = require('fs');
const xml2js = require('xml2js');
const { version: packageJSONVersion } = require('../package.json');

// Config xml
const configXmlPath = 'config.xml';
// Info plist
const infoPlistPath = 'ios/App/App/Info.plist';
const infoPlistAppVersionKey = 'CFBundleVersion';

const updatePlistFile = (appVersion) => {
    // read info.plist as text and parse into object
    const infoPlist = plist.parse(fs.readFileSync(infoPlistPath, 'utf8'));
    // update current app version key with version in package.json
    const updateInfoPlist = {
        ...infoPlist,
        [infoPlistAppVersionKey]: appVersion,
    };
    // re-build plist file with new app version
    const updatedPlist = plist.build(updateInfoPlist);
    // re-write plist file
    fs.writeFileSync(infoPlistPath, `${updatedPlist}\n`, 'utf8');
}

const updateConfigXMLFile = (appVersion) => {
    // read config.xml file
    const configXmlFile = fs.readFileSync(configXmlPath, 'utf8');
    // Parse XML to JS Obj
    xml2js.parseString(configXmlFile, (err, obj) => {
        if (err) {
            throw err;
        }
        // assign value of version in config.xml to appVersion in package.json
        obj.widget['$'].version = appVersion;

        // create xml builder
        const builder = new xml2js.Builder({
            renderOpts: { pretty: true, indent: '    ', newline: '\n' },
            xmldec : { standalone: null, encoding: 'utf-8' },
        });
        // re-create xml
        const xml = builder.buildObject(obj);
        // write config.xml with new version
        fs.writeFileSync(configXmlPath, `${xml}\n`);
    });
}

try {
    // update plist file
    updatePlistFile(packageJSONVersion);
    // update config xml file
    updateConfigXMLFile(packageJSONVersion);

    console.log(`App version successfully changed to "${packageJSONVersion}"`);
} catch (err) {
    console.error(err);
}

