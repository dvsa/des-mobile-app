import { AsamPlugin, AsamResult, AsamStatus } from '@dvsa/capacitor-plugin-asam/dist/esm';

export const Asam: AsamPlugin = {
  async toggleSingleAppMode(): Promise<AsamResult> {
    return { didSucceed: true };
  },
  async setSingleAppMode({ shouldEnable: boolean }): Promise<AsamResult> {
    return { didSucceed: true };
  },
  async isSingleAppModeEnabled(): Promise<AsamStatus> {
    return { isEnabled: false };
  },
};
