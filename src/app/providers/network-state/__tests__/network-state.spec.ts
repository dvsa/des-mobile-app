import { TestBed } from '@angular/core/testing';
import { ConnectionStatus, Network } from '@capacitor/network';
import { Platform } from '@ionic/angular';
import { PlatformMock } from '@mocks/ionic-mocks/platform-mock';
import { NetworkConnectionStatus, NetworkStateProvider } from '@providers/network-state/network-state';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';

describe('NetworkStateProvider', () => {
  let networkStateProvider: NetworkStateProvider;
  let platform: Platform;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NetworkStateProvider,
        {
          provide: Platform,
          useClass: PlatformMock,
        },
      ],
    });
    networkStateProvider = TestBed.inject(NetworkStateProvider);
    platform = TestBed.inject(Platform);

    spyOn(platform, 'ready').and.returnValue(Promise.resolve(''));
    spyOn(networkStateProvider.networkStatus$, 'next');
  });

  describe('onNetworkChange', () => {
    it('should return networkStatus as an Observable', () => {
      networkStateProvider.networkStatus$ = new BehaviorSubject<NetworkConnectionStatus>(
        NetworkConnectionStatus.ONLINE
      );
      networkStateProvider
        .onNetworkChange()
        .pipe(take(1))
        .subscribe((val) => {
          expect(val).toEqual(NetworkConnectionStatus.ONLINE);
        });
    });
  });

  describe('isOffline', () => {
    it('should return true if the piped value is Offline', () => {
      networkStateProvider.networkStatus$ = new BehaviorSubject<NetworkConnectionStatus>(
        NetworkConnectionStatus.OFFLINE
      );
      networkStateProvider
        .isOffline()
        .pipe(take(1))
        .subscribe((val) => {
          expect(val).toEqual(true);
        });
    });
    it('should return false if the piped value is Online', () => {
      networkStateProvider.networkStatus$ = new BehaviorSubject<NetworkConnectionStatus>(
        NetworkConnectionStatus.ONLINE
      );
      networkStateProvider
        .isOffline()
        .pipe(take(1))
        .subscribe((val) => {
          expect(val).toEqual(false);
        });
    });
  });

  describe('initialiseNetworkState', () => {
    it('should call apply status with current status', async () => {
      const currentStatus: ConnectionStatus = {
        connected: true,
        connectionType: 'wifi',
      };

      spyOn(Network, 'getStatus').and.resolveTo(currentStatus);
      spyOn(networkStateProvider, 'applyStatus').and.callThrough();

      await networkStateProvider.initialiseNetworkState();
      expect(networkStateProvider.applyStatus).toHaveBeenCalledWith(currentStatus);
    });
  });

  describe('applyStatus', () => {
    it('should set status to online when passed with connected = true', () => {
      networkStateProvider.applyStatus({
        connected: true,
        connectionType: 'none',
      });
      expect(networkStateProvider.networkStatus$.next).toHaveBeenCalledWith(NetworkConnectionStatus.ONLINE);
    });
    it('should set status to online when passed with connected = false', () => {
      networkStateProvider.applyStatus({
        connected: false,
        connectionType: 'none',
      });
      expect(networkStateProvider.networkStatus$.next).toHaveBeenCalledWith(NetworkConnectionStatus.OFFLINE);
    });
    it('should set connection type to the passed type', () => {
      networkStateProvider.connectionType = 'wifi';
      networkStateProvider.applyStatus({
        connected: false,
        connectionType: 'none',
      });
      expect(networkStateProvider.connectionType).toEqual('none');
    });
  });

  describe('getNetworkState', () => {
    it('should return ONLINE if network status is null and the platform is cordova', () => {
      networkStateProvider.networkStatus$ = null;
      spyOn(platform, 'is').and.returnValue(true);
      expect(networkStateProvider.getNetworkState()).toEqual(NetworkConnectionStatus.ONLINE);
    });
    it('should return ONLINE if network status is not null and the platform is not cordova', () => {
      networkStateProvider.networkStatus$ = new BehaviorSubject(NetworkConnectionStatus.OFFLINE);
      spyOn(platform, 'is').and.returnValue(false);
      expect(networkStateProvider.getNetworkState()).toEqual(NetworkConnectionStatus.ONLINE);
    });
    it('should return networkStatus$.getValue if network status is not null and the platform is cordova', () => {
      networkStateProvider.networkStatus$ = new BehaviorSubject(NetworkConnectionStatus.OFFLINE);
      spyOn(platform, 'is').and.returnValue(true);
      spyOn(networkStateProvider.networkStatus$, 'getValue').and.returnValue(NetworkConnectionStatus.OFFLINE);
      expect(networkStateProvider.getNetworkState()).toEqual(NetworkConnectionStatus.OFFLINE);
    });
  });
});
