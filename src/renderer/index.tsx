import { createRoot } from 'react-dom/client';
import zhCN from 'antd/locale/zh_CN';
import 'antd/dist/reset.css';
import { ConfigProvider } from 'antd';
import App from './App';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(
  <ConfigProvider locale={zhCN}>
    <App />
  </ConfigProvider>
);
