import { Injectable } from '@angular/core';
import { RemoteConfig } from '@dvsa/mes-config-schema/remote-config';
import * as remoteConfigSchema from '@dvsa/mes-config-schema/remote-config.json';
import { ValidatorResult, validate } from 'jsonschema';

@Injectable({
  providedIn: 'root',
})
export class SchemaValidatorProvider {
  validateRemoteConfig = (data: RemoteConfig): ValidatorResult => {
    return validate(data, remoteConfigSchema);
  };
}
