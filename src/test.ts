// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';

beforeAll(async () => {
  const origLog = console.log;
  // Create a wrapper that suppresses "AUTH CONNECT Logging set" logs so they don't clutter the console
  console.log = (...args: { toString: () => string }[]) => {
    const first = args[0]?.toString?.() ?? '';
    if (first.includes('[AUTH CONNECT] Logging set to')) return; // swallow
    return origLog(...args);
  };
});

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());

jasmine.getEnv().allowRespy(true);
