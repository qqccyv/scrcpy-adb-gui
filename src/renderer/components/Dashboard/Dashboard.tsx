import { Button, Space, Divider } from 'antd';
import './Dashboard.scss';
import adbHandlerManager from '../../core/adb/adbManager';

export default function Dashboard() {
  const getDeviceList = async () => {
    const deviceList = await adbHandlerManager.getDeviceList();
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
      </Space>
    </div>
  );
}
