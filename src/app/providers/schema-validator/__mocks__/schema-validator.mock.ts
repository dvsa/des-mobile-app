import { ValidatorResult } from 'jsonschema';

export class SchemaValidatorProviderMock {
  validateRemoteConfig = () => {
    return {
      errors: [],
    } as ValidatorResult;
  };
}
