import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.adhiasindo.kanban',
  appName: 'Adhiasindo Kanban',
  webDir: 'build',
  server: {
    androidScheme: 'https'
  }
};

export default config;
