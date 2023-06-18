import { QueryPackagesType } from './../../renderer/core/types/event';
import { exec } from 'child_process';
import { dialog } from 'electron';
import { AdbDeviceInfo, AdbPackageInfo, DeviceInfo } from 'renderer/core/types/device';
import AbsAdb from './AbsAdb';

class Adb extends AbsAdb {



  public async getDeviceList(): Promise<DeviceInfo[]> {
    try {
      const output = await this.executeCommand('devices -l');
      const devices = output
        .trim()
        .split('\n')
        .slice(1)
        .map((line) => {
          const [serial, state] = line.trim().split(/\s+/);
          return { serial, state: state as DeviceInfo['state'] };
        });

      return devices;
    } catch (error) {

      this.errorTips('Error getting device list',error)
      console.error(`Error getting device list: ${error}`);
      throw error;
    }
  }

  public async getDeviceInfo(serial: string): Promise<AdbDeviceInfo | null> {
    const command = `-s ${serial} shell getprop`;
    const output = await this.executeCommand(command);
    return this.parseDeviceInfo(output);
  }

  public async queryPackages(serial: string,type: QueryPackagesType, searchString?: string): Promise<AdbPackageInfo[]> {
    let command = `-s ${serial} shell pm list packages`;
    switch (type) {
      case QueryPackagesType.SYSTEM:
        command += ' -s';
        break;
      case QueryPackagesType.THIRD_PARTY:
        command += ' -3';
        break;
      case QueryPackagesType.NAME:
        if (searchString) {
          command += ` | grep ${searchString}`;
        }
        break;
      default:
        break;
    }

    const output = await this.executeCommand(command);
    const packages = await this.parsePackageList(output,serial);

    return packages
  }

  public async isDeviceOnline(serial: string): Promise<boolean> {
    try {
      const output = await this.executeCommand(`-s ${serial} get-state`);
      return output.trim() === 'device';
    } catch (error) {
      this.errorTips('Error checking device state',error)
      console.error(`Error checking device state: ${error}`);
      throw error;
    }
  }

  public async installApk(serial: string, apkPath: string): Promise<void> {
    try {
    await this.executeCommand(`-s ${serial} install "${apkPath}"`);
    } catch (error) {
      this.errorTips('Error installing APK',error)
      console.error(`Error installing APK: ${error}`);
      throw error;
    }
  }

  public async uninstallApk(
    serial: string,
    packageName: string
  ): Promise<void> {
    try {
      await this.executeCommand(`-s ${serial} uninstall "${packageName}"`);
    } catch (error) {
      this.errorTips('Error uninstalling app',error)
      console.error(`Error uninstalling app: ${error}`);
      throw error;
    }
  }

  public async clearAppData(
    serial: string,
    packageName: string
  ): Promise<void> {
    try {
      await this.executeCommand(`-s ${serial} shell pm clear "${packageName}"`);
    } catch (error) {
      this.errorTips('Error clearing app data',error)
      console.error(`Error clearing app data: ${error}`);
      throw error;
    }
  }

  public async getRunningActivity(serial: string): Promise<string> {

    try {
      const output = await this.executeCommand(
        `-s ${serial} shell dumpsys window windows | grep -E 'mCurrentFocus|mFocusedApp'`
      );

      const lines = output.trim().split('\n');
      const currentFocusLine = lines.find((line) =>
        line.includes('mCurrentFocus=')
      );
      const focusedAppLine = lines.find((line) =>
        line.includes('mFocusedApp=')
      );
      const currentFocus =
        currentFocusLine?.match(/mCurrentFocus=.*\{(.*?)\}/)?.[1] ?? '';
      const focusedApp =
        focusedAppLine?.match(/mFocusedApp=.*\{(.*?)\}/)?.[1] ?? '';

      return currentFocus || focusedApp;
    } catch (error) {
      this.errorTips('Error getting running activity',error)
      console.error(`Error getting running activity: ${error}`);
      throw error;
    }
  }

  public async getRunningServices(serial: string): Promise<string[]> {
    try {
      const output = await this.executeCommand(
        `-s ${serial} shell dumpsys activity service`
      );

      const lines = output.trim().split('\n');
      const serviceLines = lines.filter((line) =>
        line.trim().startsWith('ServiceRecord')
      );
      const services = serviceLines.map(
        (line) => line.match(/ServiceRecord{(.*?)}/)?.[1] ?? ''
      );
      return services;
    } catch (error) {
      this.errorTips('Error getting running services',error)
      console.error(`Error getting running services: ${error}`);
      throw error;
    }
  }

  public async getAppDetails(
    serial: string,
    packageName: string
  ): Promise<string> {
    try {
      const output = await this.executeCommand(
        `-s ${serial} shell dumpsys package "${packageName}"`
      );
      return output;
    } catch (error) {
      this.errorTips('Error getting app details',error)
      console.error(`Error getting app details: ${error}`);
      throw error;
    }
  }

  public async getAppInstallPath(
    serial: string,
    packageName: string
  ): Promise<string> {
    try {
      const output = await this.executeCommand(
        `-s ${serial} shell pm path "${packageName}"`
      );
      const path = output.trim().split(':')[1];
      return path;
    } catch (error) {
      this.errorTips('Error getting app install path',error)
      console.error(`Error getting app install path: ${error}`);
      throw error;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  private async executeCommand(command: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      exec(`adb ${command}`, (error, stdout, stderr) => {
        if (error) {
          reject(error);
        } else if (stderr) {
          reject(stderr.trim());
        } else {
          resolve(stdout.trim());
        }
      });
    });
  }

  private parseDeviceInfo(output: string): AdbDeviceInfo | null {
    const info: AdbDeviceInfo = {
      manufacturer: '',
      model: '',
      device: '',
      product: '',
      transport_id: '',
    };
    const lines = output.trim().split('\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith('ro.product.manufacturer=')) {
        info.manufacturer = line.substring('ro.product.manufacturer='.length);
      } else if (line.startsWith('ro.product.model=')) {
        info.model = line.substring('ro.product.model='.length);
      } else if (line.startsWith('ro.product.device=')) {
        info.device = line.substring('ro.product.device='.length);
      } else if (line.startsWith('ro.build.product=')) {
        info.product = line.substring('ro.build.product='.length);
      } else if (line.startsWith('ro.serialno=')) {
        info.transport_id = line.substring('ro.serialno='.length);
      }
    }
    return info;
  }

  private async parsePackageList(output: string,serial:string): Promise<AdbPackageInfo[]> {
    const packages: AdbPackageInfo[] = [];
    const lines = output.trim().split('\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      const packageInfo: AdbPackageInfo = { name: '', version: '', type: 'third-party' };
      if (line.startsWith('package:')) {
        packageInfo.name = line.substring('package:'.length);
        const versionOutput = await this.executeCommand(`-s ${serial} shell dumpsys package ${packageInfo.name} | grep versionName`);
        packageInfo.version = versionOutput.split('=')[1].trim();
        const typeOutput = await this.executeCommand(`-s ${serial} shell dumpsys package ${packageInfo.name} | grep flags=`);
        if (typeOutput.includes('FLAG_SYSTEM')) {
          packageInfo.type = 'system';
        }
        packages.push(packageInfo);
      }
    }
    return packages;
  }

  private errorTips(title:string,content:any){
    dialog.showErrorBox('adb命令执行错误:'+title,JSON.stringify(content))
  }
}

const INSTANCE = new Adb();
export default INSTANCE;
