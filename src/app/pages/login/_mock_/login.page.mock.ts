export class LoginRouterMock {
  getCurrentNavigation() {
    return {
      extras: {
        state: {
          hasLoggedOut: true,
        },
      },
    };
  }
}
