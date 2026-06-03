import { Injectable } from '@angular/core';
import { ConnectionStatus, Network } from '@capacitor/network';
import { BehaviorSubject, Observable } from 'rxjs';

export enum NetworkConnectionStatus {
  ONLINE = 0,
  OFFLINE = 1,
}

@Injectable()
export class NetworkStateProvider {
  private readonly networkStatus$ = new BehaviorSubject<number>(NetworkConnectionStatus.OFFLINE);
  private connectionType = 'unknown';

  async initialiseNetworkState(): Promise<void> {
    const status = await Network.getStatus();
    this.applyStatus(status);

    await Network.addListener('networkStatusChange', (status) => {
      this.applyStatus(status);
    });
  }

  private applyStatus(status: ConnectionStatus): void {
    this.connectionType = status.connectionType;
    this.networkStatus$.next(status.connected ? NetworkConnectionStatus.ONLINE : NetworkConnectionStatus.OFFLINE);
  }

  networkType(): string {
    return this.connectionType;
  }

  public onNetworkChange(): Observable<NetworkConnectionStatus> {
    return this.networkStatus$.asObservable();
  }

  getNetworkState(): NetworkConnectionStatus {
    return this.networkStatus$.getValue();
  }
}
