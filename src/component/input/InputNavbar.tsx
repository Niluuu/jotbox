import { FC, useRef, useState } from 'react';
import classNames from 'classnames';
import styles from './MainInput.module.scss';
import { Icon } from '../Icon/Icon';
import Popover from '../popover/Popover';
import Modal from '../modal/Modal';
import '../cart/Color.scss'

interface InputNavbarProps {
  withHistory?: boolean;
  isMainInput?: boolean;
  ontoggle?: () => void;
  onSetArchive?: () => void;
  focused?: boolean;
  onRemoveCart?: () => void;
  onLinkMode?: () => void;
  onChangeArchived?: () => void;
  onCartLabel?: (value: string) => void;
  cartLabel?: string;
  onSetLabel?: (oldGaps: string[]) => void;
  filteredGaps?: any[];
  onColorChange?: (color: string) => void;
  currentColor?: string;
  defaultColor?: string;
  onDefaultColor?: (optionalColor: string) => void;
}

export const InputNavbar: FC<InputNavbarProps> = ({
  isMainInput,
  onChangeArchived,
  onSetArchive,
  withHistory,
  ontoggle,
  focused = true,
  onRemoveCart,
  onSetLabel,
  filteredGaps,
  onLinkMode,
  onColorChange,
  currentColor,
  defaultColor,
  onDefaultColor
}) => {
  const colors = [
    { colorClass: 'default' }, 
    { colorClass: 'red' }, 
    { colorClass: 'orange' }, 
    { colorClass: 'yellow' }, 
    { colorClass: 'green' }, 
    { colorClass: 'light-blue' }, 
    { colorClass: 'blue' }, 
    { colorClass: 'bold-blue' }, 
    { colorClass: 'purple' }, 
    { colorClass: 'pink' }, 
    { colorClass: 'brown' }, 
    { colorClass: 'grey' }
  ]

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
  
  const [pop, setPop] = useState(false);
  const onPop = () => {
    setPop((pre) => !pre);
  };

  const [label, setLabel] = useState('');
  const [labelEdit, setLabelEdit] = useState(false);
  const onLabelEdit = () => {
    setLabelEdit((pre) => !pre);
  };

  return (
    <div className={classNames(styles.input_navbar, !focused && styles.hide)}>
      <div className={styles.main_tools}>
        <button type="button" className={styles.icon_btn}>
          <Icon name="user-add" color="premium" size="xs" />
        </button>
        <button onClick={toArchive} type="button" className={styles.icon_btn}>
          <Icon name="dowland" color="premium" size="xs" />
        </button>
        <Popover placement="bottom-start"
    content={
       <div className={styles.colorWrapper}> 
          { colors.map((color) => 
           <button 
                type='button' 
                onClick={() => {
                  if (isMainInput) onDefaultColor(color.colorClass) 
                  else onColorChange(color.colorClass) 
                  }} 
                  className={classNames(color.colorClass, isMainInput 
                    ? color.colorClass === defaultColor && styles.active 
                    : color.colorClass === currentColor && styles.active
                  )}> { color.colorClass === 'default' && 
                <Icon name="default-color" color="premium" size="xs" />
              } </button> 
            )}
            </div>} >
          <button type="button" className={styles.icon_btn}>
            <Icon name="color-picer" color="premium" size="xs" />
          </button>
        </Popover>
        <Popover
          isOpen={pop}
          content={
            <div className={classNames(styles.navbar_popover, styles.navbar_popover_settings)}>
              <ul className={styles.popover_content}>
                <li key="1" onClick={() => {
                  onLinkMode();
                  onPop() 
                  }}>
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
                      onPop() 
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
          <button onClick={onPop} type="button" className={styles.icon_btn}>
            <Icon name="other" color="premium" size="xs" />
          </button>
        </Popover>
        <Modal title='Add Label' toggleModal={onLabelEdit} isOpen={labelEdit}>
          <div className={classNames(styles.navbar_popover, styles.labels, styles.navbar_popover_settings)}>
            <div style={{width: '100%'}}>
              <input placeholder="Enter new name..." onChange={(e) => setLabel(e.target.value)} value={label} type="text" />
            </div>
            { gaps.map((gap) => 
              <div className={styles.labels__input}>
              <button onClick={() => onChangeGaps(gap.name)} type="button"> 
                <Icon name={gap.isChecked ? 'exit' : 'done'} color="premium" size="xs" /> 
              </button> 
                { gap.name }
              </div>
            )}
            <div>
              <button type="button" className={styles.confirm} onClick={() => {
                onLabelEdit()
                onSetLabel([label, ...gaps.map((gap) => gap.isChecked && gap.name)])
                }}>
                Confirm 
              </button>
            </div>
          </div>
        </Modal>
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
