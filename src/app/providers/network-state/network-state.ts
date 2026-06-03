import { Injectable } from '@angular/core';
import { ConnectionStatus, Network } from '@capacitor/network';
import { Platform } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';

export enum NetworkConnectionStatus {
  ONLINE = 0,
  OFFLINE = 1,
}

@Injectable()
export class NetworkStateProvider {
  networkStatus$ = new BehaviorSubject<number>(NetworkConnectionStatus.OFFLINE);
  connectionType = 'unknown';

  constructor(private platform: Platform) {}

  async initialiseNetworkState(): Promise<void> {
    const status = await Network.getStatus();
    this.applyStatus(status);

    await Network.addListener('networkStatusChange', (status) => {
      this.applyStatus(status);
    });
  }

  applyStatus(status: ConnectionStatus): void {
    this.connectionType = status.connectionType;
    this.networkStatus$.next(status.connected ? NetworkConnectionStatus.ONLINE : NetworkConnectionStatus.OFFLINE);
  }

  onNetworkChange(): Observable<NetworkConnectionStatus> {
    return this.networkStatus$.asObservable();
  }

  getNetworkState(): NetworkConnectionStatus {
    if (!this.networkStatus$ || !this.platform.is('cordova')) {
      return NetworkConnectionStatus.ONLINE;
    }
    return this.networkStatus$.getValue();
  }
}
