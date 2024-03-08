import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'uk.gov.dvsa.drivingexaminerservices',
  appName: 'DES',
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
  ios: {
    preferredContentMode: 'mobile',
  },
};

export default config;
