export interface DeviceInfo {
  serial: string;
  state: 'device' | 'offline' | 'unauthorized' | 'unknown';
}
