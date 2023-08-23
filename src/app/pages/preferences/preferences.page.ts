import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { ResetPreferences, SetPreference } from '@store/preferences/preferences.actions';
import { PreferencesStateModel } from '@store/preferences/preferences.reducer';
import { selectEnableSAMForDeviceAuth } from '@store/preferences/preferences.selector';
import { PreferencesPageViewDidEnter } from '@pages/preferences/preferences.actions';
import { DeviceProvider } from '@providers/device/device';
import { BasePageComponent } from '@shared/classes/base-page';
import { Platform } from '@ionic/angular';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { Router } from '@angular/router';

@Component({
  selector: 'preferences-page',
  templateUrl: 'preferences.page.html',
  styleUrls: ['preferences.page.scss'],
})
export class PreferencesPage extends BasePageComponent {
  store$ = inject<Store<StoreModel>>(Store);
  deviceProvider = inject(DeviceProvider);
  enableSAMForDeviceAuth = this.store$.selectSignal(selectEnableSAMForDeviceAuth);

  constructor(
    platform: Platform,
    authenticationProvider: AuthenticationProvider,
    router: Router,
  ) {
    super(platform, authenticationProvider, router, false);
  }

  ionViewDidEnter() {
    this.store$.dispatch(PreferencesPageViewDidEnter());
  }

  presentLockedInCard = async () => {
    if (this.isIos()) {
      return this.deviceProvider.isSAMEnabled();
    }
    return true;
  };

  disableSAM = async () => {
    if (this.isIos()) {
      return this.deviceProvider.manuallyDisableSingleAppMode();
    }
  };

  preferenceChanged = (preference: keyof PreferencesStateModel) => {
    this.store$.dispatch(SetPreference(preference));
  };

  resetPreferences = () => {
    this.store$.dispatch(ResetPreferences());
  };
}
