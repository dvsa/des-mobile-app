import { Injectable } from '@angular/core';
import * as remoteConfigSchema from '@dvsa/mes-config-schema/remote-config.json';
import { validate, ValidatorResult } from 'jsonschema';
import { RemoteConfig } from '@dvsa/mes-config-schema/remote-config';

@Injectable()
export class SchemaValidatorProvider {

  validateRemoteConfig = (data: RemoteConfig): ValidatorResult => {
    return validate(data, remoteConfigSchema);
  };

}
