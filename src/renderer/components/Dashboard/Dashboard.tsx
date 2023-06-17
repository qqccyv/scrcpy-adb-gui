import { Button, Space } from 'antd';
import './Dashboard.scss';

export default function Dashboard() {
  const getDeviceList = () => {
    // do something
  };
  return (
    <div className="module">
      <Space wrap>
        <Button onClick={getDeviceList} type="primary">
          设备列表
        </Button>
      </Space>
    </div>
  );
}
