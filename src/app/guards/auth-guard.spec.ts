import { TestBed } from '@angular/core/testing';
import { AuthGuard } from './auth-guard';
import { AuthenticationProvider } from '../providers/authentication/authentication';
import { AuthenticationProviderMock } from '../providers/authentication/__mocks__/authentication.mock';

describe('AuthGuard', () => {
  let guard: AuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthenticationProvider, useClass: AuthenticationProviderMock },
      ],
    });
    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  describe('canActivate', () => {
    beforeEach(() => {
      spyOn(guard.authenticationProvider, 'isAuthenticated').and.returnValue(Promise.resolve(true));
    });
    it('should allow access when not running on ios device', async () => {
      spyOn(guard, 'isIos').and.returnValue(Promise.resolve(false));
      expect(await guard.canActivate()).toEqual(true);
      expect(guard.authenticationProvider.isAuthenticated).not.toHaveBeenCalled();
    });
    it('should call through to auth service and return value when on ios device', async () => {
      spyOn(guard, 'isIos').and.returnValue(Promise.resolve(true));
      expect(await guard.canActivate()).toEqual(true);
      expect(guard.authenticationProvider.isAuthenticated).toHaveBeenCalled();
    });
  });

});
