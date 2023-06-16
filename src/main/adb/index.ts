import { spawnSync } from 'child_process';

enum Adb_Command {
  DEVICES = 'devices',
}

export default class Adb {
  private arguments: string[] = [];

  async execute() {
    const { output, error, signal, status } = await spawnSync(
      'adb',
      this.arguments,
      {
        encoding: 'utf-8',
      }
    );
    console.log('output', output);
  }

  getDevicesList() {
    this.arguments.push(Adb_Command.DEVICES);
    return this;
  }
}
