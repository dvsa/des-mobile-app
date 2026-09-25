// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js/testing';
import { ComponentFixture, getTestBed } from '@angular/core/testing';
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';
import { iconList } from '@shared/constants/ion-icon-list';
import { addIcons } from 'ionicons';

const detectChanges = ComponentFixture.prototype.detectChanges;
ComponentFixture.prototype.detectChanges = function (checkNoChanges = false) {
  return detectChanges.call(this, checkNoChanges);
};

beforeAll(async () => {
  addIcons(iconList);
  const origLog = console.log;
  // Create a wrapper that suppresses "AUTH CONNECT Logging set" logs so they don't clutter the console
  console.log = (...args: { toString: () => string }[]) => {
    const first = args[0]?.toString?.() ?? '';
    if (first.includes('[AUTH CONNECT] Logging set to')) return; // swallow
    return origLog(...args);
  };
});

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(BrowserTestingModule, platformBrowserTesting());

jasmine.getEnv().allowRespy(true);
