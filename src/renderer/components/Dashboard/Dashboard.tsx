import { Button, Space,Divider } from 'antd';
import './Dashboard.scss';

export default function Dashboard() {
  const getDeviceList = () => {
    // do something
  };
  return (
    <div className="module">
      <h3>adb 命令</h3>
      <Divider/>
      <Space wrap>
        <Button onClick={getDeviceList} type="primary">
          设备列表
        </Button>
      </Space>
    </div>
  );
}
