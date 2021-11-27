import { FC, useRef, useState } from 'react';
import classNames from 'classnames';
import styles from './MainInput.module.scss';
import { Icon } from '../Icon/Icon';
import Popover from '../popover/Popover';

interface InputNavbarProps {
  isLogin?: boolean;
  withHistory?: boolean;
  isMainInput?: boolean;
  onOptionEditMode?: () => void;
  onHyperLinkEditMode?: () => void;
  ontoggle?: () => void;
  onSetArchive?: () => void;
  focused?: boolean;
  onRemoveCart?: () => void;
  onChangeArchived?: () => void;
  onSetIsMain?: (bool: boolean) => void;
  onCartLabel?: (value: string) => void;
  cartLabel?: string;
  onSetLabel?: (oldGaps: string[]) => void;
  filteredGaps?: any[];
}

export const InputNavbar: FC<InputNavbarProps> = ({
  isLogin,
  isMainInput,
  onChangeArchived,
  onSetArchive,
  onHyperLinkEditMode,
  onOptionEditMode,
  withHistory,
  ontoggle,
  focused = true,
  onRemoveCart,
  onSetIsMain,
  onSetLabel,
  filteredGaps,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const onEdit = () => {
    if (isMainInput) onSetIsMain(true);
    else onSetIsMain(false);

    if (onHyperLinkEditMode) onHyperLinkEditMode();
  };

  const toArchive = () => {
    if (isMainInput) onSetArchive();
    else onChangeArchived();
  };

  const [gaps, setGaps] = useState(
    filteredGaps 
      ? filteredGaps.map((gap) => ({ name: gap, isChecked: false }))
      : []
  );
  const onChangeGaps = (value) => {
    setGaps(gaps.map((gap) => (
      { ...gap, isChecked: value === gap.name ? !gap.isChecked : gap.isChecked }
    )))
  }
  
  const [label, setLabel] = useState('');
  const [labelEdit, setLabelEdit] = useState(false);
  const onLabelEdit = () => {
    setLabelEdit((pre) => !pre);
  };

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
        <Popover
          content={
            <div className={classNames(styles.navbar_popover, styles.navbar_popover_settings)}>
              <ul className={styles.popover_content}>
                <li key="1" onClick={onEdit}>
                  {' '}
                  <a href="#">Добавить линк</a>{' '}
                </li>
                {onRemoveCart && (
                  <li key="2" onClick={onRemoveCart}>
                    {' '}
                    <a href="#">Удалить карточку</a>{' '}
                  </li>
                )}
                <li key="4">
                  <a
                    onClick={() => {
                      onLabelEdit();
                    }}
                    href="#"
                  >
                    Добавить ярлык
                  </a>{' '}
                </li>
              </ul>
            </div>
          }
          placement="bottom-start">
          <button type="button" className={styles.icon_btn}>
            <Icon name="other" color="premium" size="xs" />
          </button>
        </Popover>
        <Popover
          isOpen={labelEdit}
          content={
            <div className={classNames(styles.navbar_popover, styles.labels, styles.navbar_popover_settings)}>
              <div>
                <input placeholder="Enter name..." onChange={(e) => setLabel(e.target.value)} value={label} type="text" />
              </div>
              { gaps.map((gap) => 
                <div className={styles.labels__input}>
                  <input type="checkbox" 
                    onChange={() => onChangeGaps(gap.name)} checked={gap.isChecked} /> 
                    { gap.name }
                </div>
              )}
              <div>
                <button type="button" onClick={() => {
                  onSetLabel([label, ...gaps.map((gap) => gap.isChecked && gap.name)])
                  }}>
                  Add label
                </button>
              </div>
            </div>
          }
          placement="bottom-start"
        >
          <span style={{ color: '#fff', display: 'none' }}>i</span>
        </Popover>
        {withHistory ? (
          <>
            <button style={{position: 'relative', right: '3px'}} type="button" className={styles.icon_btn}>
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
