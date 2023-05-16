import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'uk.gov.dvsa.drivingexaminerservices',
  appName: 'DES',
  webDir: 'www',
  plugins: {
    SplashScreen: {
      launchAutoHide: false,
    },
  },
  cordova: {},
};

export default config;
