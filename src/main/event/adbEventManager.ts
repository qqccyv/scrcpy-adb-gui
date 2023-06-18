import { BrowserWindow, ipcMain } from 'electron';
import { AdbEventChannel } from '../../renderer/core/types/event';
import adb from '../adb';

export default class AdbEventManager {
  private win: BrowserWindow;

  constructor(win: BrowserWindow) {
    this.win = win;
    this.initIpcMainHandler();
  }

  private initIpcMainHandler() {
    ipcMain.on(AdbEventChannel.GET_DEVICES_LIST, async (event, arg) => {
      event.reply(AdbEventChannel.GET_DEVICES_LIST, await adb.getDeviceList());
    });
  }
}
