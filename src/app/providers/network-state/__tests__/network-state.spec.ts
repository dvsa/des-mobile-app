import { TestBed } from '@angular/core/testing';
import { ConnectionStatus, NetworkStateProvider } from '@providers/network-state/network-state';
import { Network } from '@awesome-cordova-plugins/network/ngx';
import { BehaviorSubject } from 'rxjs';

describe('NetworkStateProvider', () => {

  let networkStateProvider: NetworkStateProvider;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NetworkStateProvider,
        Network,
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
});
