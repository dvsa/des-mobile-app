import type { NetworkPlugin } from '@capacitor/network/dist/esm/definitions';

export type {
  ConnectionStatus,
  ConnectionStatusChangeListener,
  ConnectionType,
  NetworkPlugin,
} from '@capacitor/network/dist/esm/definitions';

export const Network: NetworkPlugin = {
  async getStatus() {
    return { connected: true, connectionType: 'wifi' };
  },
  async addListener() {
    return { remove: async () => {} };
  },
  async removeAllListeners() {},
};
