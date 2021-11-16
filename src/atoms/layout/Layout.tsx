import { FC } from 'react';
import { Header } from '../../modules/Header/Header';
import { Sider } from '../../modules/Sider/Sider';

export interface LayoutProps {
  gridType: boolean;
  toggleSider: () => void;
  changeGrid: () => void;
  isSidebarOpen: boolean;
}

const Layout: FC<LayoutProps> = (props) => {
  const { gridType, toggleSider, changeGrid, isSidebarOpen, children } = props;

  return (
    <>
      <Header gridType={gridType} onClick={toggleSider} changeGrid={changeGrid} />
      <section className="layout">
        <Sider isSidebarOpen={isSidebarOpen} onClick={toggleSider} />
        {children}
      </section>
    </>
  );
};

export default Layout;