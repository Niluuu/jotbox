import { FC, useState } from 'react';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import styles from './HomePage.module.scss';
import MainInput from '../../component/input/MainInput';
import CartLayout from '../../component/cart-layout/CartLayout';
import Layout from '../../atoms/layout/Layout';
import { RootState } from '../../app/store';
import AddLinkModal from '../../atoms/modals/AddLinkModal';

interface CartProps {
  id: any;
  title: string;
  description: string;
  pined: boolean;
  archived: boolean;
  gaps: any[];
}

export interface HomePageProps {
  onSetArchive?: () => void;
  onSetCart?: () => void;
  onHyperLinkEditMode?: () => void;
  defaultPin: boolean;
  onDefaultPin: () => void;
  onSetIsMain?: (bool: boolean) => void;
  onChangePin?: (id: any, title: string, description: any) => void;
  onChangeArchived?: (id: any, title: string, description: any) => void;
  onRemoveCart?: (id: any) => void;
  carts: CartProps[];
  cartHyper?: any;
  onReSetCart?: (id: any, title: string, description: any) => void;
  filteredGaps?: any[];
  onCartLabel?: (value: string) => void;
  cartLabel?: string;
  onSetLabel?: (id, oldGaps: string[]) => void;
  onReSetLabel: (oldValue, newValue) => void;
}

const HomePage: FC<HomePageProps> = ({
  filteredGaps,
  carts,
  cartHyper,
  onChangeArchived,
  onChangePin,
  onReSetCart,
  onRemoveCart,
  defaultPin,
  onHyperLinkEditMode,
  onSetArchive,
  onSetCart,
  onDefaultPin,
  onSetIsMain,
  onCartLabel,
  cartLabel,
  onSetLabel,
  onReSetLabel,
}) => {

  const [focused, setFocused] = useState(false);
  const mapStateToProps = useSelector((state: RootState) =>  {
    return state.layoutGridTypeReducer
  });
  
  const { grid } = mapStateToProps
  return (
    <Layout
      filteredGaps={filteredGaps}
      onReSetLabel={onReSetLabel}
    >
      <div className={classNames(styles.home_page, grid && styles.column)}>
        <div className={styles.home_page__main_input}>
          <MainInput
            focused={focused}
            setFocused={setFocused}
            onHyperLinkEditMode={onHyperLinkEditMode}
            onSetArchive={onSetArchive}
            onSetCart={onSetCart}
            defaultPin={defaultPin}
            onDefaultPin={onDefaultPin}
            onSetIsMain={onSetIsMain}
          />
        </div>
        <CartLayout
          onChangePin={onChangePin}
          onReSetCart={onReSetCart}
          onChangeArchived={onChangeArchived}
          onRemoveCart={onRemoveCart}
          gridType={grid}
          carts={carts}
          cartHyper={cartHyper}
          onHyperLinkEditMode={onHyperLinkEditMode}
          onSetIsMain={onSetIsMain}
          onCartLabel={onCartLabel}
          cartLabel={cartLabel}
          onSetLabel={onSetLabel}
          filteredGaps={filteredGaps}
        />
       <AddLinkModal/>
      </div>
    </Layout>
  );
};


export default HomePage;
