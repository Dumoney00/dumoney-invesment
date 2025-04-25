
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.8182cd2c297a44b5b0a1c773f5531117',
  appName: 'dumoney-investment',
  webDir: 'dist',
  server: {
    url: 'https://8182cd2c-297a-44b5-b0a1-c773f5531117.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  android: {
    buildOptions: {
      releaseType: 'APK'
    }
  }
};

export default config;
