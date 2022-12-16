import { AsamResult, AsamStatus, AsamPlugin } from '@asam';

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
