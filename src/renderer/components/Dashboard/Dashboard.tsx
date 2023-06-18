import { Button, Space, Divider, Dropdown, MenuProps } from 'antd';
import './Dashboard.scss';
import { useState,useEffect } from 'react';
import adbHandlerManager from '../../core/adb/adbManager';
import { DeviceInfo } from '../../core/types/device';
type DeviceItemType = {
  key:string,
  label:string
}
export default function Dashboard() {
  const [deviceList, setDeviceList] = useState<DeviceItemType[]>([]);
  const [currentDevice, setCurrentDevice] = useState<DeviceItemType>();

  useEffect(() => {
    if(deviceList.length === 1) setCurrentDevice(deviceList[0])
  }, [deviceList])

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

  const installApk = async () => {
    if(!currentDevice) return
    adbHandlerManager.inStallApk(currentDevice.key)
  }

  const getRunningActivity = async () => {
    if(!currentDevice) return
    adbHandlerManager.getRunningActivity(currentDevice.key)
  }

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
            onClick: ({key}) => {
              setCurrentDevice(deviceList.find(device=>device.key===key))
            }
          }}
          placement="topLeft"
        >
          <Button>{currentDevice ? currentDevice.label : '请先初始化设备列表'}</Button>
        </Dropdown>
        <Button onClick={installApk} type="primary">
          安装Apk
        </Button>
        <Button onClick={getRunningActivity} type="primary">
          获取活动页
        </Button>
      </Space>
    </div>
  );
}
