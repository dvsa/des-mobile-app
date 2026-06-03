import { TestBed, fakeAsync, flushMicrotasks } from '@angular/core/testing';
import { Network } from '@awesome-cordova-plugins/network/ngx';
import { Platform } from '@ionic/angular';
import { PlatformMock } from '@mocks/ionic-mocks/platform-mock';
import { NetworkConnectionStatus, NetworkStateProvider } from '@providers/network-state/network-state';
import { BehaviorSubject, of } from 'rxjs';
import { take } from 'rxjs/operators';

class NetworkMock {
  get type() {
    return 'none';
  }

  onConnect = () => of(null);
  onDisconnect = () => of(null);
}

describe('NetworkStateProvider', () => {
  let networkStateProvider: NetworkStateProvider;
  let network: Network;
  let platform: Platform;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NetworkStateProvider,
        {
          provide: Network,
          useClass: NetworkMock,
        },
        {
          provide: Platform,
          useClass: PlatformMock,
        },
      ],
    });
    networkStateProvider = TestBed.inject(NetworkStateProvider);
    network = TestBed.inject(Network);
    platform = TestBed.inject(Platform);

    spyOn(platform, 'ready').and.returnValue(Promise.resolve(''));
    spyOn(networkStateProvider.isOffline$, 'next');
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
  describe('initialiseNetworkState', () => {
    it('should set status to ONLINE and call isOffline with false if type is not none', fakeAsync(() => {
      spyOnProperty(network, 'type', 'get').and.returnValue('test');
      networkStateProvider.initialiseNetworkState();
      flushMicrotasks();
      expect(networkStateProvider.isOffline$.next).toHaveBeenCalledWith(false);
    }));
    it('should set status to OFFLINE and call isOffline with true if type is none', fakeAsync(() => {
      spyOnProperty(network, 'type', 'get').and.returnValue('none');
      networkStateProvider.initialiseNetworkState();
      flushMicrotasks();
      expect(networkStateProvider.isOffline$.next).toHaveBeenCalledWith(true);
    }));
  });
  describe('initialiseNetworkEvents', () => {
    it('should run onDisconnect and update updateNetworkStatus', () => {
      spyOn(network, 'onDisconnect').and.returnValue(of({ data: 'testData' }));
      spyOn(networkStateProvider, 'updateNetworkStatus');
      networkStateProvider.initialiseNetworkEvents();
      expect(network.onDisconnect).toHaveBeenCalled();
      expect(networkStateProvider.updateNetworkStatus).toHaveBeenCalledWith(NetworkConnectionStatus.OFFLINE);
    });
    it('should run onConnect and update updateNetworkStatus', () => {
      spyOn(network, 'onConnect').and.returnValue(of({ data: 'testData' }));
      spyOn(networkStateProvider, 'updateNetworkStatus');
      networkStateProvider.initialiseNetworkEvents();
      expect(network.onConnect).toHaveBeenCalled();
      expect(networkStateProvider.updateNetworkStatus).toHaveBeenCalledWith(NetworkConnectionStatus.ONLINE);
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
  describe('updateNetworkStatus', () => {
    it('should call next for networkStatus with passed variable', () => {
      spyOn(networkStateProvider.networkStatus$, 'next');
      networkStateProvider.updateNetworkStatus(NetworkConnectionStatus.OFFLINE);
      expect(networkStateProvider.networkStatus$.next).toHaveBeenCalledWith(NetworkConnectionStatus.OFFLINE);
    });
    it('should call next for isOffline with true is passed variable is OFFLINE', () => {
      networkStateProvider.updateNetworkStatus(NetworkConnectionStatus.OFFLINE);
      expect(networkStateProvider.isOffline$.next).toHaveBeenCalledWith(true);
    });
    it('should call next for isOffline with false is passed variable is ONLINE', () => {
      networkStateProvider.updateNetworkStatus(NetworkConnectionStatus.ONLINE);
      expect(networkStateProvider.isOffline$.next).toHaveBeenCalledWith(false);
    });
  });
});
