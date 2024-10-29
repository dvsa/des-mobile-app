import { Component } from '@angular/core';
import { DeviceProvider } from '@providers/device/device';
import { AppLauncher } from '@capacitor/app-launcher';

@Component({
  selector: 'exit-sam-button',
  templateUrl: './exit-sam-button.html',
  styleUrls: ['./exit-sam-button.scss'],
})
export class ExitSamButton {
  constructor(public deviceProvider: DeviceProvider) {}

  async DisableSAMAndExit() {
    await this.deviceProvider.disableSingleAppMode();
    try {
      // Go to teams
      // await AppLauncher.openUrl({ url: 'msteams://teams.microsoft.com' });
      // Go to settings
      // await AppLauncher.openUrl({ url: 'App-prefs://'});
      // go to home screen?
      await AppLauncher.openUrl({ url: 'App-prefs://#home' });
    } catch (e) {
      console.log(e);
    }
    console.log('DisableSAMAndExit');
  }
}
