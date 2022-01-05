import { FC, useState } from 'react';
import { Header } from '../../modules/Header/Header';
import { Sider } from '../../modules/Sider/Sider';

const Layout: FC = (props) => {
  const { children } = props;
  const [isSidebarOpen, setisSidebarOpen] = useState(true);
  const toggleSider = () => setisSidebarOpen((pre) => !pre);

  return (
    <>
      <Header onClick={toggleSider} />
      <section className="layout">
        <Sider isSidebarOpen={isSidebarOpen} onClick={toggleSider} />
        {children}
      </section>
    </>
  );
};

export default Layout;
