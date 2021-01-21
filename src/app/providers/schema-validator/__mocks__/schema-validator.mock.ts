import { ValidationResult } from 'joi';

export class SchemaValidatorProviderMock {
  validateRemoteConfig = (): ValidationResult => {
    return {
      error: null,
      value: {},
      // then: jasmine.createSpy('then', () => {}),
      // catch: jasmine.createSpy('catch', () => {}),
    };
  };
}
