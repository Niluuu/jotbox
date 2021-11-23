import { FC } from 'react';
import { Header } from '../../modules/Header/Header';
import { Sider } from '../../modules/Sider/Sider';

export interface LayoutProps {
  gridType: boolean;
  toggleSider: () => void;
  changeGrid: () => void;
  isSidebarOpen: boolean;
  filterByLetter: (value: string) => void;
  filterLetter: any;
  filteredGaps: any[];
}

const Layout: FC<LayoutProps> = (props) => {
  const { gridType, toggleSider, filterByLetter, filteredGaps, filterLetter, changeGrid, isSidebarOpen, children } = props;

  return (
    <>
      <Header filterByLetter={filterByLetter} filterLetter={filterLetter} gridType={gridType} onClick={toggleSider} changeGrid={changeGrid} />
      <section className="layout">
        <Sider filteredGaps={filteredGaps} isSidebarOpen={isSidebarOpen} onClick={toggleSider} />
        {children}
      </section>
    </>
  );
};

export default Layout;
