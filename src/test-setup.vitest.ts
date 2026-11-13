import { Buffer } from 'buffer';
import { ComponentFixture } from '@angular/core/testing';
import { beforeAll } from 'vitest';

export const unitTestErrorCause: string = 'Unit Test';

if (typeof window !== 'undefined') {
  Object.assign(window, { Buffer, global: window });
  beforeAll(async () => {
    const [{ iconList }, { addIcons }] = await Promise.all([
      import('@shared/constants/ion-icon-list'),
      import('ionicons'),
    ]);
    addIcons(iconList);

    const origError = console.error;
    // Create a wrapper that suppresses "AUTH CONNECT Logging set" logs so they don't clutter the console
    console.error = (error: Error) => {
      if (error.cause === unitTestErrorCause) return; // swallow
      return origError(error);
    };
  });
}

const detectChangesPatched = Symbol.for('des.test.detectChangesPatched');
if (!Object.hasOwn(ComponentFixture.prototype, detectChangesPatched)) {
  const detectChanges = ComponentFixture.prototype.detectChanges;
  ComponentFixture.prototype.detectChanges = function (checkNoChanges = false) {
    return detectChanges.call(this, checkNoChanges);
  };
  Object.defineProperty(ComponentFixture.prototype, detectChangesPatched, { value: true });
}
