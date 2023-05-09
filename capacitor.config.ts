import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'uk.gov.dvsa.drivingexaminerservices',
  appName: 'DES',
  bundledWebRuntime: false,
  webDir: 'www',
  plugins: {
    SplashScreen: {
      launchAutoHide: false,
    },
    CapacitorCookies: {
      enabled: true,
    },
  },
  cordova: {},
};

export default config;
