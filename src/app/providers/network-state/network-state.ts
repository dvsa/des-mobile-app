import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Platform } from '@ionic/angular';
import { Network } from '@awesome-cordova-plugins/network/ngx';

export enum ConnectionStatus {
  ONLINE = 0,
  OFFLINE = 1,
}

@Injectable()
export class NetworkStateProvider {

  private networkStatus$: BehaviorSubject<ConnectionStatus> = new BehaviorSubject(ConnectionStatus.OFFLINE);
  public isOffline$: BehaviorSubject<boolean> = new BehaviorSubject(true);

  constructor(private network: Network, private platform: Platform) {
  }

  initialiseNetworkState(): void {
    this.platform.ready().then(() => {
      this.initialiseNetworkEvents();
      const status = this.network.type !== 'none' ? ConnectionStatus.ONLINE : ConnectionStatus.OFFLINE;
      this.networkStatus$.next(status);
      this.isOffline$.next(status === ConnectionStatus.OFFLINE);
    });
  }

  private initialiseNetworkEvents(): void {
    this.network.onDisconnect().subscribe(() => {
      this.updateNetworkStatus(ConnectionStatus.OFFLINE);
    });

    this.network.onConnect().subscribe(() => {
      this.updateNetworkStatus(ConnectionStatus.ONLINE);
    });
  }

  public updateNetworkStatus(status: ConnectionStatus) {
    this.networkStatus$.next(status);
    this.isOffline$.next(status === ConnectionStatus.OFFLINE);
  }

  public onNetworkChange(): Observable<ConnectionStatus> {
    return this.networkStatus$.asObservable();
  }

  /**
   * Gets whether the network is online or offline
   * NOTE: networkStatus$ guard clause allows app to run in browser
   * @returns ConnectionStatus
   */
  public getNetworkState(): ConnectionStatus {
    if (!this.networkStatus$ || !this.platform.is('cordova')) {
      return ConnectionStatus.ONLINE;
    }
    return this.networkStatus$.getValue();
  }
}
