import { Button, Space, Divider, Dropdown, MenuProps } from 'antd';
import './Dashboard.scss';
import { useState } from 'react';
import adbHandlerManager from '../../core/adb/adbManager';
import { DeviceInfo } from '../../core/types/device';

export default function Dashboard() {
  const [deviceList, setDeviceList] = useState<MenuProps['items']>([]);
  const [currentDevice, setCurrentDevice] = useState<{
    key: string;
    label: string;
  }>();
  const getDeviceList = async () => {
    const devices: DeviceInfo[] = await adbHandlerManager.getDeviceList();
    setDeviceList(
      devices.map((deviceInfo) => {
        return {
          key: deviceInfo.serial,
          label: `${deviceInfo.serial}   ${deviceInfo.state}`,
        };
      })
    );
    console.log('deviceList', deviceList);
  };

  return (
    <div className="module">
      <h3>adb 命令</h3>
      <Divider />
      <Space wrap>
        <Button onClick={getDeviceList} type="primary">
          设备列表
        </Button>
        <Dropdown
          menu={{
            items: deviceList,
          }}
          placement="topLeft"
        >
          <Button>{currentDevice ? currentDevice.label : '选择设备'}</Button>
        </Dropdown>
      </Space>
    </div>
  );
}
