import { Observable, of } from 'rxjs';
import { ConnectionStatus } from '../network-state';

export class NetworkStateProviderMock {

  public onNetworkChange(): Observable<ConnectionStatus> {
    return of(ConnectionStatus.OFFLINE);
  }

  public initialiseNetworkState():void {}

  public getNetworkState(): ConnectionStatus {
    return ConnectionStatus.ONLINE;
  }

}
