import { MdmConfig } from '@dvsa/mes-config-schema/mdm-config';
import { RemoteConfig } from '@dvsa/mes-config-schema/remote-config';

export interface EnvironmentFile extends MdmConfig {

  // this is required by main.ts so that Ionic knows when to enable production mode
  production: boolean;
}

export interface LocalEnvironmentFile extends MdmConfig, RemoteConfig {

  // this is required by main.ts so that Ionic knows when to enable production mode
  production: boolean;
}

export interface TestersEnvironmentFile extends MdmConfig {

  // this is required by main.ts so that Ionic knows when to enable production mode
  production: boolean;

  // boolean for testers to be able to control certain aspects of the app
  isTest: boolean;
}
