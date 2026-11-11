import { TestBed } from '@angular/core/testing';
import { ConnectionStatus, Network } from '@capacitor/network';
import { Platform } from '@ionic/angular';
import { PlatformMock } from '@mocks/ionic-mocks/platform-mock';
import { NetworkConnectionStatus, NetworkStateProvider } from '@providers/network-state/network-state';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { beforeEach, describe, expect, it, vi } from 'vitest';

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

    vi.spyOn(platform, 'ready').mockReturnValue(Promise.resolve(''));
    vi.spyOn(networkStateProvider.networkStatus$, 'next').mockReturnValue(undefined);
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
      networkStateProvider.isOffline$.pipe(take(1)).subscribe((val) => {
        expect(val).toEqual(true);
      });
    });
    it('should return false if the piped value is Online', () => {
      networkStateProvider.networkStatus$ = new BehaviorSubject<NetworkConnectionStatus>(
        NetworkConnectionStatus.ONLINE
      );
      networkStateProvider.isOffline$.pipe(take(1)).subscribe((val) => {
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

      vi.spyOn(Network, 'getStatus').mockResolvedValue(currentStatus);
      vi.spyOn(networkStateProvider, 'applyStatus');

      await networkStateProvider.initialiseNetworkState();
      expect(Network.getStatus).toHaveBeenCalledTimes(1);
      expect(networkStateProvider.applyStatus).toHaveBeenCalledWith(currentStatus);
    });

    it('should apply status when the network changes', async () => {
      const changedStatus: ConnectionStatus = {
        connected: false,
        connectionType: 'none',
      };
      const addListener = vi.spyOn(Network, 'addListener').mockResolvedValue({ remove: async () => {} });
      const applyStatus = vi.spyOn(networkStateProvider, 'applyStatus');

      await networkStateProvider.initialiseNetworkState();
      applyStatus.mockClear();

      expect(addListener).toHaveBeenCalledWith('networkStatusChange', expect.any(Function));
      const [, listener] = vi.mocked(addListener).mock.lastCall;
      listener(changedStatus);

      expect(applyStatus).toHaveBeenCalledTimes(1);

      expect(applyStatus).toHaveBeenCalledWith(changedStatus);
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
    it('should set status to offline when passed with connected = false', () => {
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
      vi.spyOn(platform, 'is').mockReturnValue(true);
      expect(networkStateProvider.getNetworkState()).toEqual(NetworkConnectionStatus.ONLINE);
    });
    it('should return ONLINE if network status is not null and the platform is not cordova', () => {
      networkStateProvider.networkStatus$ = new BehaviorSubject(NetworkConnectionStatus.OFFLINE);
      vi.spyOn(platform, 'is').mockReturnValue(false);
      expect(networkStateProvider.getNetworkState()).toEqual(NetworkConnectionStatus.ONLINE);
    });
    it('should return networkStatus$.getValue if network status is not null and the platform is cordova', () => {
      networkStateProvider.networkStatus$ = new BehaviorSubject(NetworkConnectionStatus.OFFLINE);
      vi.spyOn(platform, 'is').mockReturnValue(true);
      vi.spyOn(networkStateProvider.networkStatus$, 'getValue').mockReturnValue(NetworkConnectionStatus.OFFLINE);
      expect(networkStateProvider.getNetworkState()).toEqual(NetworkConnectionStatus.OFFLINE);
    });
  });
});
