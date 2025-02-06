const url = 'some-url';

export interface OpenURLResult {
  completed: boolean;
}

export const AppLauncher = {
  canOpenUrl: async ({ url }) => ({ value: true }),
  openUrl: async ({ url }) => ({ completed: true }),
};
