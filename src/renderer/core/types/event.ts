export enum AdbEventChannel {
  GET_DEVICES_LIST = 'get_devices',
  INSTALL_APK = 'install_apk',
  GET_RUNNING_ACTIVITY = 'get_running_activity',
  GET_RUNNING_SERVICES = 'get_running_services',
  QUERY_PACKAGES = 'query_packages'
}


export enum QueryPackagesType {
  ALL = 'all',
  SYSTEM = 'system',
  THIRD_PARTY = 'third-party',
  NAME = 'name'
}
