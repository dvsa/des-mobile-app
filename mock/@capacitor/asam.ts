import { AsamPlugin, AsamResult, AsamStatus } from '../../../../../Swift Training/capacitor-plugin-asam';

export const Asam: AsamPlugin = {
  async toggleSingleAppMode(): Promise<AsamResult> {
    return {didSucceed: true}
  },
  async setSingleAppMode({ shouldEnable: boolean }): Promise<AsamResult> {
    return {didSucceed: true}
  },
  async isSingleAppModeEnabled(): Promise<AsamStatus> {
    return {isEnabled: false}
  }
}
