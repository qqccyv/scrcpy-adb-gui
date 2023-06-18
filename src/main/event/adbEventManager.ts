import { BrowserWindow, dialog, ipcMain } from 'electron';
import { AdbEventChannel, QueryPackagesType } from '../../renderer/core/types/event';
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

    ipcMain.on(AdbEventChannel.INSTALL_APK, async (event, arg) => {
      console.log('INSTALL_APK',arg);

      const apkPaths =  await dialog.showOpenDialogSync(this.win,{
        title:'选择需要安装的Apk',
        filters:[{name:'Apk',extensions:['apk']}],
        properties:['openFile']
      })
      const apkPath = apkPaths?.shift()
      if(!apkPath) return
      event.reply(AdbEventChannel.INSTALL_APK, await adb.installApk(arg,apkPath));
    });

    ipcMain.on(AdbEventChannel.GET_RUNNING_ACTIVITY, async (event, arg) => {
      event.reply(AdbEventChannel.GET_RUNNING_ACTIVITY, await adb.getRunningActivity(arg));
    });

    ipcMain.on(AdbEventChannel.GET_RUNNING_SERVICES, async (event, arg) => {
      event.reply(AdbEventChannel.GET_RUNNING_SERVICES, await adb.getRunningServices(arg));
    });

    ipcMain.on(AdbEventChannel.QUERY_PACKAGES, async (event, serial: string,type: QueryPackagesType, searchString?: string) => {
      console.log(serial,type,searchString);

      event.reply(AdbEventChannel.QUERY_PACKAGES, await adb.queryPackages(serial,type,searchString));
    });
  }
}
