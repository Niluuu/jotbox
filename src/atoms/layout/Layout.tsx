import { FC, useState } from 'react';
import { Header } from '../../modules/Header/Header';
import { Sider } from '../../modules/Sider/Sider';

interface LayoutProps {
  toggleSider: () => void;
  isSidebarOpen: boolean;
}
const Layout: FC<LayoutProps> = ({ children, toggleSider, isSidebarOpen }) => {
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
