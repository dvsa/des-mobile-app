import { Injectable } from '@angular/core';

import { validate } from 'joi-browser';
import { ValidationResult, Schema } from 'joi';
// The enjoi-browser package doesn't suport ES6 imports
const enjoi = require('node_modules/enjoi-browser/lib/enjoi.js');
const remoteConfigSchema = require('@dvsa/mes-config-schema/remote-config.json');

@Injectable()
export class SchemaValidatorProvider {

  validateRemoteConfig = (data: any): ValidationResult => {
    const joiSchema: Schema = enjoi(remoteConfigSchema);
    return validate(data, joiSchema);
  };

}
