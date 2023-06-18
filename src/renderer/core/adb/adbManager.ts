import { QueryPackagesType } from './../types/event';
import { AdbPackageInfo, DeviceInfo } from '../types/device';
import { AdbEventChannel } from '../types/event';

const { ipcRenderer } = window.electron;

class AdbHandlerManager {

  public getDeviceList(): Promise<DeviceInfo[]> {
    return new Promise((resolve, reject) => {
      ipcRenderer.once(
        AdbEventChannel.GET_DEVICES_LIST,
        (devices) => {
          resolve(devices as DeviceInfo[]);
        }
      );
      ipcRenderer.sendMessage(AdbEventChannel.GET_DEVICES_LIST);
    });
  }

  public inStallApk(serialNum:string){
    return new Promise((resolve, reject) => {
      ipcRenderer.sendMessage(AdbEventChannel.INSTALL_APK,serialNum);
    });
  }

  public getRunningActivity(serialNum:string){
    return new Promise((resolve, reject) => {
      ipcRenderer.once(
        AdbEventChannel.GET_RUNNING_ACTIVITY,
        (focusedApp) => {
          resolve(focusedApp as string);
        }
      );
      ipcRenderer.sendMessage(AdbEventChannel.GET_RUNNING_ACTIVITY,serialNum);
    });
  }

  public getRunningServices(serialNum:string){
    return new Promise((resolve, reject) => {
      ipcRenderer.once(
        AdbEventChannel.GET_RUNNING_SERVICES,
        (services) => {
          resolve(services as string[]);
        }
      );
      ipcRenderer.sendMessage(AdbEventChannel.GET_RUNNING_SERVICES,serialNum);
    });
  }

  public queryPackages(serialNum:string,type:QueryPackagesType,keyword:string){
    return new Promise((resolve, reject) => {
      ipcRenderer.once(
        AdbEventChannel.QUERY_PACKAGES,
        (adbPackages) => {
          resolve(adbPackages as AdbPackageInfo[]);
        }
      );
      ipcRenderer.sendMessage(AdbEventChannel.QUERY_PACKAGES,serialNum,type,keyword);
    });
  }
}

const INSTANCE = new AdbHandlerManager();

export default INSTANCE;
