import { MdmConfig } from '@dvsa/mes-config-schema/mdm-config';
import { RemoteConfig } from '@dvsa/mes-config-schema/remote-config';

export interface EnvironmentFile extends MdmConfig {
}

export interface LocalEnvironmentFile extends MdmConfig, RemoteConfig {
}
