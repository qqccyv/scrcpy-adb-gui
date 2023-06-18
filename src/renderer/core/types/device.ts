export interface DeviceInfo {
  serial: string;
  state: 'device' | 'offline' | 'unauthorized' | 'unknown';
}


export interface AdbDeviceInfo {
  manufacturer: string;
  model: string;
  device: string;
  product: string;
  transport_id: string;
}

export interface AdbPackageInfo {
  name: string;
  version: string;
  type: 'system' | 'third-party';
}
