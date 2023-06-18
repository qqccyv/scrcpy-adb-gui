import { Button, Space, Divider, Dropdown, Input } from 'antd';
import './Dashboard.scss';
import { useState,useEffect } from 'react';
import adbHandlerManager from '../../core/adb/adbManager';
import { DeviceInfo } from '../../core/types/device';
import { QueryPackagesType } from 'renderer/core/types/event';
type DeviceItemType = {
  key:string,
  label:string
}

export default function Dashboard() {
  const [deviceList, setDeviceList] = useState<DeviceItemType[]>([]);
  const [currentDevice, setCurrentDevice] = useState<DeviceItemType>();
  const queryPackagesTypeList = Object.values(QueryPackagesType).map(type=>{
    return {
      key:type,
      label:type
    }
  })
  const [currentQueryType, setCurrentQueryType] = useState(queryPackagesTypeList[0].key);
  const [keyword, setKeyword] = useState('')
  const [queryLoading, setQueryLoading] = useState(false)


  useEffect(() => {
    console.log('deviceList', deviceList);
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

  };

  const installApk = async () => {
    if(!currentDevice) return
    adbHandlerManager.inStallApk(currentDevice.key)
  }

  const getRunningActivity = async () => {
    if(!currentDevice) return
  const focusedApp = await  adbHandlerManager.getRunningActivity(currentDevice.key)
  console.log('focusedApp',focusedApp);

  }

  const getRunningServices = async () => {
    if(!currentDevice) return
  const services = await  adbHandlerManager.getRunningServices(currentDevice.key)
  console.log('services',services);

  }

  const queryPackages = async () => {
    if(!currentDevice) return
    setQueryLoading(true)
  const packages = await  adbHandlerManager.queryPackages(currentDevice.key,currentQueryType,keyword)
    console.log('packages',packages);
    setQueryLoading(false)
  }

  return (
    <div className="module">
      <h3>adb 命令</h3>
      <Divider />
      <Space wrap>
        <Button onClick={getDeviceList} type="primary">
          初始化设备列表
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
        <Button onClick={getRunningServices} type="primary">
          获取服务列表
        </Button>
        <Dropdown
          menu={{
            items: queryPackagesTypeList,
            selectable: true,
            selectedKeys:[currentQueryType],
            onSelect:({key}) => {
              setCurrentQueryType(key as QueryPackagesType)
            }
          }}
          placement="topLeft"
        >
          <Button loading={queryLoading} onClick={queryPackages} >查询应用包</Button>
        </Dropdown>
        { currentQueryType === QueryPackagesType.NAME &&   <Input
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value)
            }}
            onPressEnter={queryPackages}
            placeholder="Enter your keyword"
            prefix={<span>包含有：</span>}
    />  }
      </Space>
    </div>
  );
}
