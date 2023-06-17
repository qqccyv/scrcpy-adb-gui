import { exec } from 'child_process';
import { DeviceInfo } from 'renderer/core/types/device';
import AbsAdb from './AbsAdb';

class Adb extends AbsAdb {
  public async getDeviceList(): Promise<DeviceInfo[]> {
    try {
      const output = await this.executeCommand('devices');
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
      console.error(`Error getting device list: ${error}`);
      throw error;
    }
  }

  public async isDeviceOnline(serial: string): Promise<boolean> {
    try {
      const output = await this.executeCommand(`-s ${serial} get-state`);
      return output.trim() === 'device';
    } catch (error) {
      console.error(`Error checking device state: ${error}`);
      throw error;
    }
  }

  public async installApk(serial: string, apkPath: string): Promise<void> {
    try {
      await this.executeCommand(`-s ${serial} install "${apkPath}"`);
    } catch (error) {
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
}

const INSTANCE = new Adb();
export default INSTANCE;
