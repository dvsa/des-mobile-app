import { Injectable } from '@angular/core';
import { ConnectionStatus, Network } from '@capacitor/network';
import { Platform } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export enum NetworkConnectionStatus {
  ONLINE = 0,
  OFFLINE = 1,
}

@Injectable()
export class NetworkStateProvider {
  networkStatus$: BehaviorSubject<NetworkConnectionStatus> = new BehaviorSubject<number>(
    NetworkConnectionStatus.OFFLINE
  );
  connectionType = 'unknown';

  constructor(private platform: Platform) {}

  /**
   * Initialises the network state, setting up initial values and the listener to update them.
   */
  async initialiseNetworkState(): Promise<void> {
    const status = await Network.getStatus();
    this.applyStatus(status);

    await Network.addListener('networkStatusChange', (status) => {
      this.applyStatus(status);
    });
  }

  /**
   * Updates the accessible variables within the service with new values based on the current Connection status
   * @param status - The new connection status details
   */
  applyStatus(status: ConnectionStatus): void {
    this.connectionType = status.connectionType;
    this.networkStatus$.next(status.connected ? NetworkConnectionStatus.ONLINE : NetworkConnectionStatus.OFFLINE);
  }

  /**
   * Returns the current network status as an observable
   */
  onNetworkChange(): Observable<NetworkConnectionStatus> {
    return this.networkStatus$.asObservable();
  }

  /**
   * Returns whether the network status is currently offline
   */
  get isOffline$(): Observable<boolean> {
    return this.onNetworkChange().pipe(map((status) => status === NetworkConnectionStatus.OFFLINE));
  }

  /**
   * Returns the current value of the network state, treating the browser as ONLINE
   */
  getNetworkState(): NetworkConnectionStatus {
    if (!this.networkStatus$ || !this.platform.is('cordova')) {
      return NetworkConnectionStatus.ONLINE;
    }
    return this.networkStatus$.getValue();
  }
}
