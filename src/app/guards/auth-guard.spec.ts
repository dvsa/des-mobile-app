import { TestBed } from '@angular/core/testing';
import { AuthGuard } from './auth-guard';
import { AuthenticationProvider } from '../providers/authentication/authentication';
import { AuthenticationProviderMock } from '../providers/authentication/_mocks_/authentication.mock';

describe('AuthGuard', () => {
  let guard: AuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthenticationProvider, useClass: AuthenticationProviderMock },
      ]
    });
    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
