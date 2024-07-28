export const isDeviceThemeDarkMode = (): boolean => !!window.matchMedia('(prefers-color-scheme: dark)')?.matches;
