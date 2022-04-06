import { FC } from 'react';
import classNames from 'classnames';
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
      <section className={classNames('layout', isSidebarOpen && 'open')}>
        <Sider isSidebarOpen={isSidebarOpen} onClick={toggleSider} />
        {children}
      </section>
    </>
  );
};

export default Layout;
