import { FC, useState } from 'react';
import { Header } from '../../modules/Header/Header';
import { Sider } from '../../modules/Sider/Sider';

export interface LayoutProps {
  filteredGaps: any[];
  onReSetLabel: (oldValue, newValue) => void;
  onFilterSearch: (value: string) => void;
}

const Layout: FC<LayoutProps> = (props) => {
  const { onReSetLabel, filteredGaps, children, onFilterSearch } = props;
  const [isSidebarOpen, setisSidebarOpen] = useState(true);
  const toggleSider = () => setisSidebarOpen((pre) => !pre);

  return (
    <>
      <Header onFilterSearch={onFilterSearch} onClick={toggleSider}  />
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
