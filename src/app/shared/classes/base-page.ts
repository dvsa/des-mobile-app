import { Platform } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { NavigationExtras, Router } from '@angular/router';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { LOGIN_PAGE } from '../../pages/page-names.constants';
import { SaveLog } from '../../../store/logs/logs.actions';
import { LogType } from '../models/log.model';
import { LogHelper } from '../../providers/logs/logs-helper';

export abstract class BasePageComponent {

  protected constructor(
    protected platform: Platform,
    protected authenticationProvider: AuthenticationProvider,
    protected router: Router,
    private store$: Store,
    private logHelper: LogHelper,
  ) {

  }

  isIos(): boolean {
    return this.platform.is('ios');
  }

  async logout() {
    if (this.isIos()) {
      try {
        await this.authenticationProvider.logout();
      } catch (error) {
        this.store$.dispatch(SaveLog({
          payload: this.logHelper.createLog(LogType.ERROR, 'Logout', error.message),
        }));
      } finally {
        const navigationExtras: NavigationExtras = {
          state: {
            hasLoggedOut: true,
          },
        };
        await this.router.navigate([LOGIN_PAGE], navigationExtras);
      }
    }
  }

}
