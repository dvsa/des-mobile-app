import { TestBed } from '@angular/core/testing';
import { ConnectionStatus, NetworkStateProvider } from '@providers/network-state/network-state';
import { Network } from '@awesome-cordova-plugins/network/ngx';
import { BehaviorSubject, of } from 'rxjs';
import { Platform } from '@ionic/angular';
import { PlatformMock } from '@mocks/ionic-mocks/platform-mock';

describe('NetworkStateProvider', () => {

  let networkStateProvider: NetworkStateProvider;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NetworkStateProvider,
        Network,
        { provide: Platform, useClass: PlatformMock },
      ],
    });

    networkStateProvider = TestBed.inject(NetworkStateProvider);
  });

  describe('onNetworkChange', () => {
    it('should return networkStatus as an Observable', () => {
      networkStateProvider['networkStatus$'] = new BehaviorSubject<ConnectionStatus>(ConnectionStatus.ONLINE);
      networkStateProvider.onNetworkChange().subscribe((val) => {
        expect(val).toEqual(ConnectionStatus.ONLINE);
      });
    });
  });

  fdescribe('initialiseNetworkState', () => {
    it('should set status to ONLINE and call isOffline with false if type is not none', () => {
      networkStateProvider['network'].type = 'test';
      spyOn(networkStateProvider.isOffline$, 'next');
      spyOn(networkStateProvider['platform'], 'ready').and.callThrough();
      networkStateProvider.initialiseNetworkState();

      expect(networkStateProvider.isOffline$.next).toHaveBeenCalledWith(false);
    });
    it('should set status to OFFLINE and call isOffline with true if type is none', () => {
      networkStateProvider['network'].type = 'none';
      spyOn(networkStateProvider.isOffline$, 'next');
      spyOn(networkStateProvider['platform'], 'ready').and.callThrough();

      networkStateProvider.initialiseNetworkState();

      expect(networkStateProvider.isOffline$.next).toHaveBeenCalledWith(true);
    });
  });

  describe('initialiseNetworkEvents', () => {
    it('should run onDisconnect and update updateNetworkStatus', () => {
      spyOn(networkStateProvider['network'], 'onDisconnect').and.returnValue(of({ data: 'testData' }));
      spyOn(networkStateProvider, 'updateNetworkStatus');

      networkStateProvider['initialiseNetworkEvents']();

      expect(networkStateProvider['network'].onDisconnect).toHaveBeenCalled();
      expect(networkStateProvider['updateNetworkStatus']).toHaveBeenCalledWith(ConnectionStatus.OFFLINE);
    });
    it('should run onConnect and update updateNetworkStatus', () => {
      spyOn(networkStateProvider['network'], 'onConnect').and.returnValue(of({ data: 'testData' }));
      spyOn(networkStateProvider, 'updateNetworkStatus');

      networkStateProvider['initialiseNetworkEvents']();

      expect(networkStateProvider['network'].onConnect).toHaveBeenCalled();
      expect(networkStateProvider['updateNetworkStatus']).toHaveBeenCalledWith(ConnectionStatus.ONLINE);
    });
  });

  describe('getNetworkState', () => {

    it('should return ONLINE if network status is null and the platform is cordova', () => {
      networkStateProvider['networkStatus$'] = null;
      spyOn(networkStateProvider['platform'], 'is').and.returnValue(true);
      expect(networkStateProvider.getNetworkState()).toEqual(ConnectionStatus.ONLINE);
    });
    it('should return ONLINE if network status is not null and the platform is not cordova', () => {
      networkStateProvider['networkStatus$'] = new BehaviorSubject(ConnectionStatus.OFFLINE);
      spyOn(networkStateProvider['platform'], 'is').and.returnValue(false);
      expect(networkStateProvider.getNetworkState()).toEqual(ConnectionStatus.ONLINE);
    });
    it('should return networkStatus$.getValue if network status is not null and the platform is cordova', () => {
      networkStateProvider['networkStatus$'] = new BehaviorSubject(ConnectionStatus.OFFLINE);
      spyOn(networkStateProvider['platform'], 'is').and.returnValue(true);

      spyOn(networkStateProvider['networkStatus$'], 'getValue').and.returnValue(ConnectionStatus.OFFLINE);
      expect(networkStateProvider.getNetworkState()).toEqual(ConnectionStatus.OFFLINE);
    });
  });

  describe('updateNetworkStatus', () => {
    it('should call next for networkStatus with passed variable', () => {
      spyOn(networkStateProvider['networkStatus$'], 'next');

      networkStateProvider.updateNetworkStatus(ConnectionStatus.OFFLINE);

      expect(networkStateProvider['networkStatus$'].next).toHaveBeenCalledWith(ConnectionStatus.OFFLINE);
    });
    it('should call next for isOffline with true is passed variable is OFFLINE', () => {
      spyOn(networkStateProvider['isOffline$'], 'next');

      networkStateProvider.updateNetworkStatus(ConnectionStatus.OFFLINE);

      expect(networkStateProvider['isOffline$'].next).toHaveBeenCalledWith(true);
    });
    it('should call next for isOffline with false is passed variable is ONLINE', () => {
      spyOn(networkStateProvider['isOffline$'], 'next');

      networkStateProvider.updateNetworkStatus(ConnectionStatus.ONLINE);

      expect(networkStateProvider['isOffline$'].next).toHaveBeenCalledWith(false);
    });
  });
});
