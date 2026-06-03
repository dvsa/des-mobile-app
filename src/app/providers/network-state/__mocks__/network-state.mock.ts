import { BehaviorSubject, Observable, of } from 'rxjs';
import { NetworkConnectionStatus } from '../network-state';

export class NetworkStateProviderMock {
  public onNetworkChange(): Observable<NetworkConnectionStatus> {
    return of(NetworkConnectionStatus.OFFLINE);
  }

  public initialiseNetworkState(): void {}

  public getNetworkState(): NetworkConnectionStatus {
    return NetworkConnectionStatus.ONLINE;
  }

  public isOffline$: BehaviorSubject<boolean> = new BehaviorSubject(true);
}
