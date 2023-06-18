import { DeviceInfo } from '../types/device';
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
      this.resolve = resolve;
      ipcRenderer.sendMessage(AdbEventChannel.GET_RUNNING_ACTIVITY,serialNum);
    });
  }
}

const INSTANCE = new AdbHandlerManager();

export default INSTANCE;
