import { vi } from 'vitest';
export class AuthenticationProviderMock {
  init = vi.fn().mockReturnValue(Promise.resolve());

  setProviderOptions = vi.fn().mockReturnValue(Promise.resolve());

  getEmployeeId = vi.fn().mockReturnValue('12345678');

  decodeToken = vi.fn().mockResolvedValue({ name: 'joe blogs', id: '12345678' });

  getAuthenticationToken = vi.fn().mockResolvedValue('token');

  loadEmployeeDetails = vi.fn().mockReturnValue(Promise.resolve());

  refreshEmployeeDetails = vi.fn().mockReturnValue(Promise.resolve());

  storeAuthResult = vi.fn().mockReturnValue(Promise.resolve());

  getAuthResult = vi.fn().mockReturnValue(Promise.resolve());

  getStoredAuthResult = vi.fn().mockReturnValue(Promise.resolve());

  login = vi.fn().mockReturnValue(Promise.resolve());

  isOffline = vi.fn().mockReturnValue(false);

  refreshSession = vi.fn().mockReturnValue(Promise.resolve());

  isAuthenticated = vi.fn().mockReturnValue(Promise.resolve(true));

  hasTokenExpired = vi.fn().mockReturnValue(Promise.resolve(true));

  clearStore = vi.fn().mockReturnValue(Promise.resolve());

  logout = vi.fn().mockReturnValue(Promise.resolve());
}
