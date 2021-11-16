import { FC, useState } from 'react';
import classNames from 'classnames';
import styles from './HomePage.module.scss';
import MainInput from '../../component/input/MainInput';
import CartLayout from '../../component/cart-layout/CartLayout';
import Modal from '../../component/modal/Modal';
import { Icon } from '../../component/Icon/Icon';
import Layout from '../../atoms/layout/Layout';

interface CartProps {
  id: any;
  title: string;
  description: string;
  pined: boolean;
  archived: boolean;
  gaps: any[];
}

export interface HomePageProps {
  gridType: boolean;
  focused: boolean;
  onHyperLinkEditMode: () => void;
  onDefaultPin: () => void;
  onSetCart: () => void;
  onCloseModal: () => void;
  onSetHyperLink: () => void;
  onSetArchive: () => void;
  textRef?: any;
  titleRef?: any;
  defaultPin: boolean;
  hyperLinkEditMode: boolean;
  hyper: any;
  setFocused: (e: boolean) => void;
  carts: CartProps[];
  cartTitleRef?: any;
  cartTextRef?: any;
  cartHyper?: any;
  onRemoveCart?: (id: any) => void;
  onChangePin?: (id: any, title: string, description: any) => void;
  onReSetCart?: (id: any, title: string, description: any) => void;
  onChangeArchived?: (id: any, title: string, description: any) => void;
  onSetIsMain?: (bool: boolean) => void;
  setHyperText: (e: any) => void;
  setHyperLink: (e: any) => void;
  hyperText: any;
  hyperLink: any;
  toggleSider: () => void;
  changeGrid: () => void;
  isSidebarOpen: boolean;
}

const HomePage: FC<HomePageProps> = ({
  gridType,
  setHyperLink,
  setHyperText,
  hyperText,
  hyperLink,
  onCloseModal,
  onSetHyperLink,
  setFocused,
  carts,
  cartHyper,
  onChangeArchived,
  onChangePin,
  onReSetCart,
  onRemoveCart,
  textRef,
  hyperLinkEditMode,
  titleRef,
  defaultPin,
  hyper,
  focused,
  onHyperLinkEditMode,
  onSetArchive,
  onSetCart,
  onDefaultPin,
  onSetIsMain,
  toggleSider,
  changeGrid,
  isSidebarOpen,
}) => {
  const [textFocus, setTextFocus] = useState(false);
  const [linkFocus, setLinkFocus] = useState(false);

  return (
    <Layout
      gridType={gridType}
      toggleSider={toggleSider}
      isSidebarOpen={isSidebarOpen}
      changeGrid={changeGrid}
    >
      <div className={classNames(styles.home_page, gridType && styles.column)}>
        <div className={styles.home_page__main_input}>
          <MainInput
            focused={focused}
            setFocused={setFocused}
            onHyperLinkEditMode={onHyperLinkEditMode}
            onSetArchive={onSetArchive}
            onSetCart={onSetCart}
            titleRef={titleRef}
            textRef={textRef}
            gridType={gridType}
            defaultPin={defaultPin}
            onDefaultPin={onDefaultPin}
            onSetIsMain={onSetIsMain}
            hyper={hyper}
          />
        </div>
        <CartLayout
          onChangePin={onChangePin}
          onReSetCart={onReSetCart}
          onChangeArchived={onChangeArchived}
          onRemoveCart={onRemoveCart}
          carts={carts}
          cartHyper={cartHyper}
          onHyperLinkEditMode={onHyperLinkEditMode}
          onSetIsMain={onSetIsMain}
          gridType={gridType}
        />
        <Modal
          title="Добавить линк"
          isTop={!!true}
          isOpen={hyperLinkEditMode}
          toggleModal={onCloseModal}
        >
          <div className={styles.gaps}>
            <Icon name={textFocus ? 'exit' : 'add'} color="premium" size="xs" />
            <input
              type="text"
              value={hyperText}
              onChange={(e) => setHyperText(e.currentTarget.value)}
              placeholder="Введите текст..."
              onFocus={() => setTextFocus(true)}
              onBlur={() => setTextFocus(false)}
            />
            {textFocus && <Icon name="done" color="premium" size="xs" />}
          </div>
          <div className={styles.gaps}>
            <Icon name={linkFocus ? 'exit' : 'add'} color="premium" size="xs" />
            <input
              type="text"
              value={hyperLink}
              onChange={(e) => setHyperLink(e.currentTarget.value)}
              placeholder="Введите линк..."
              onFocus={() => setLinkFocus(true)}
              onBlur={() => setLinkFocus(false)}
            />
            {linkFocus && <Icon name="done" color="premium" size="xs" />}
          </div>
          <div className={styles.bottom_btn} onClick={onSetHyperLink}>
            <button type="button">Done</button>
          </div>
        </Modal>
      </div>
    </Layout>
  );
};

export default HomePage;