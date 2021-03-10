import { Injectable } from '@angular/core';
import remoteConfigSchema from '@dvsa/mes-config-schema/remote-config.json';
import { validate, ValidatorResult } from 'jsonschema';

@Injectable()
export class SchemaValidatorProvider {

  validateRemoteConfig = (data: any): ValidatorResult => {
    return validate(data, remoteConfigSchema);
  };

}
