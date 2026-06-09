import { Observable, of } from 'rxjs';
import { NetworkConnectionStatus } from '../network-state';

export class NetworkStateProviderMock {
  public onNetworkChange(): Observable<NetworkConnectionStatus> {
    return of(NetworkConnectionStatus.OFFLINE);
  }

  public async initialiseNetworkState(): Promise<void> {}

  public getNetworkState(): NetworkConnectionStatus {
    return NetworkConnectionStatus.ONLINE;
  }

  get isOffline$(): Observable<boolean> {
    return of(false);
  }
}
