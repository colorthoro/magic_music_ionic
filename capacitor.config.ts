import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'magic_music_ionic',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    "url": "http://192.168.43.201:8100/",
    cleartext: true,
  }
};

export default config;
