import { DeviceInfo } from '../types/device';
import { AdbEventChannel } from '../types/event';

const { ipcRenderer } = window.electron;

class AdbHandlerManager {
  private resolve?: (...arg: any[]) => void;

  constructor() {
    this.initIpcRendererHandler();
  }

  private initIpcRendererHandler() {
    ipcRenderer.on(
      AdbEventChannel.GET_DEVICES_LIST,
      (devices: DeviceInfo[]) => {
        this.resolve?.(devices);
      }
    );
  }

  public getDeviceList(): Promise<DeviceInfo[]> {
    return new Promise((resolve, reject) => {
      this.resolve = resolve;
      ipcRenderer.sendMessage(AdbEventChannel.GET_DEVICES_LIST);
    });
  }
}

const INSTANCE = new AdbHandlerManager();

export default INSTANCE;
