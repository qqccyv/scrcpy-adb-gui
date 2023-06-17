import { BrowserWindow ,ipcMain} from 'electron';
import adb from '../adb';

export enum AdbEventChannel {
  GET_DEVICES_LIST = 'get_devices'
}
export default class AdbEventManager {
  private win:BrowserWindow
  constructor(win:BrowserWindow){
    this.win = win
    this.initIpcMainHander()
  }

 private initIpcMainHander(){
  ipcMain.on(AdbEventChannel.GET_DEVICES_LIST, async (event,arg) => {
    event.reply(AdbEventChannel.GET_DEVICES_LIST, await this.getDevicesList());

  })
  }

  private async  getDevicesList(){
    return  await adb.getDeviceList();
  }
}
