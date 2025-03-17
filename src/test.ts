// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { Device } from '@capacitor/device';

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());

jasmine.getEnv().allowRespy(true);

const specStartTime = 0;
const specStartMemory = 0;

jasmine.getEnv().addReporter({
  specStarted: function (result) {
    Device.getInfo().then((info) => {
      this.specStartMemory = info.memUsed;
    });
    this.specStartTime = Date.now();
  },
  specDone: function (result) {
    const seconds = (Date.now() - this.specStartTime) / 1000;
    let memoryUsed = 0;
    Device.getInfo().then((info) => {
      memoryUsed = info.memUsed;
    });
    console.log(`Memory at start: ${this.specStartMemory} bytes. Memory at end: ${memoryUsed} bytes`);
    if (seconds > 0.5) {
      console.log(`WARNING - This spec took ${seconds} seconds: "${result.fullName}"`);
    }
  },
});
