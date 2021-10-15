import { FC, useRef, useState } from 'react';
import classNames from 'classnames';
import styles from './MainInput.module.scss';
import { Icon } from '../Icon/Icon';
import Popover from '../popover/Popover';

interface InputNavbarProps {
  isLogin?: boolean;
  withHistory?: boolean;
  isOpen?: boolean;
  isMainInput?: boolean;
  onOptionEditMode?: () => void;
  onHyperLinkEditMode?: () => void;
  ontoggle?: () => void;
  onSetArchive?: () => void;
  focused?: boolean;
  onRemoveCart?: () => void;
  onChangeArchived?: (id: any) => void;
  id?: any
}

export const InputNavbar: FC<InputNavbarProps> = ({ isLogin, isMainInput, id, onChangeArchived, onSetArchive, isOpen, onHyperLinkEditMode, onOptionEditMode, withHistory, ontoggle, focused = true, onRemoveCart }) => {
  const toArchive = () => {
    if (isMainInput) onSetArchive()
    else onChangeArchived(id)
  }
  return (
    <div className={classNames(styles.input_navbar, !focused && styles.hide)}>
      <div className={styles.main_tools}>
        <button type="button" className={styles.icon_btn}>
          <Icon name="notification-add" color="premium" size="xs" />
        </button>
        <button type="button" className={styles.icon_btn}>
          <Icon name="user-add" color="premium" size="xs" />
        </button>
        <button type="button" className={styles.icon_btn}>
          <Icon name="img" color="premium" size="xs" />
        </button>
        <button onClick={toArchive} type="button" className={styles.icon_btn}>
          <Icon name="dowland" color="premium" size="xs" />
        </button>
        <Popover content={
          <div className={classNames(styles.navbar_popover, styles.navbar_popover_settings)}>
            <ul className={styles.popover_content}>
              <li key="1" onClick={onHyperLinkEditMode}> <a href="#">Добавить линк</a> </li>
              { onRemoveCart && 
              <li key="2" onClick={onRemoveCart}> <a href="#">Удалить карточку</a> </li> }
            </ul>
          </div> } placement="bottom-start" >
          <button type="button" className={styles.icon_btn}>
            <Icon name="other" color="premium" size="xs" />
          </button>
        </Popover>
        { withHistory ? (
          <>
            <button type="button" className={styles.icon_btn}>
              <Icon name="back" color="premium" size="xs" />
            </button>
            <button type="button" className={classNames(styles.icon_btn, styles.icon_rotate)}>
              <Icon name="back" color="premium" size="xs" />
            </button>
          </>
        ) : null}
      </div>
      <button onClick={ontoggle} type="button" className={styles.btn}>
        Закрыть
      </button>
    </div>
  );
};
