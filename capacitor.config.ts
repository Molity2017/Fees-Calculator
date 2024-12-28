import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.elbayaa.feescalculator',
  appName: 'حاسبة العمولة',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
