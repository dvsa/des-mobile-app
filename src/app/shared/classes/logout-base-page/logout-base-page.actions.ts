import { createAction } from '@ngrx/store';

export const LogoutConfirmed = createAction('[Logout] Logout Confirmed', (unuploadedTestCount: number) => ({
  unuploadedTestCount,
}));

export const LogoutCancelled = createAction('[Logout] Logout Cancelled', (unuploadedTestCount: number) => ({
  unuploadedTestCount,
}));

export const LogoutSuccess = createAction('[Logout] Logout Success');

export const LogoutError = createAction('[Logout] Logout Error');

export const LogoutModalChanged = createAction('[Logout] Logout Modal Changed', (unuploadedTestCount: number) => ({
  unuploadedTestCount,
}));
