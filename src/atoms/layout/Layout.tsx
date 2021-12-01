import { FC } from 'react';
import { Header } from '../../modules/Header/Header';
import { Sider } from '../../modules/Sider/Sider';

export interface LayoutProps {
  gridType: boolean;
  toggleSider: () => void;
  changeGrid: () => void;
  isSidebarOpen: boolean;
  filteredGaps: any[];
  onReSetLabel: (oldValue, newValue) => void;
}

const Layout: FC<LayoutProps> = (props) => {
  const { gridType, toggleSider, onReSetLabel, filteredGaps, changeGrid, isSidebarOpen, children } = props;

  return (
    <>
      <Header 
        gridType={gridType} 
        onClick={toggleSider} 
        changeGrid={changeGrid} />
      <section className="layout">
        <Sider 
          filteredGaps={filteredGaps} 
          onReSetLabel={onReSetLabel} 
          isSidebarOpen={isSidebarOpen} 
          onClick={toggleSider} />
        {children}
      </section>
    </>
  );
};

export default Layout;
