import {
  BiometricOptions,
  DeleteCredentialOptions,
  GetCredentialOptions,
  IsAvailableOptions,
  SetCredentialOptions,
} from 'capacitor-native-biometric/dist/esm/definitions';

export const NativeBiometric = {
  isAvailable: async (e?: IsAvailableOptions) => {
    return Promise.resolve();
  },
  verifyIdentity: async (e?: BiometricOptions) => {
    return Promise.resolve();
  },
  getCredentials: async (e: GetCredentialOptions) => {
    return Promise.resolve();
  },
  setCredentials: async (e: SetCredentialOptions) => {
    return Promise.resolve();
  },
  deleteCredentials: async (e: DeleteCredentialOptions) => {
    return Promise.resolve();
  },
};
