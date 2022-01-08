import { FC, useState, useEffect, useCallback } from 'react';
import classNames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import { API, graphqlOperation } from 'aws-amplify';
import { RootState } from '../../app/store';
import styles from './MainInput.module.scss';
import { Icon } from '../Icon/Icon';
import Popover from '../popover/Popover';
import '../cart/Color.scss';
import { colors } from '../../utils/editor/color';
import { listGapss } from '../../graphql/queries';

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
  onColorChange?: (color: string) => void;
  currentColor?: string;
  defaultColor?: string;
  onDefaultColor?: (optionalColor: string) => void;
  initialGaps?: string[];
  toggleGaps?: (gap: string) => void;
  selectedGaps: string[];
}

export const InputNavbar: FC<InputNavbarProps> = (props) => {
  const {
    isMainInput,
    onChangeArchived,
    onSetArchive,
    withHistory,
    ontoggle,
    focused = true,
    onRemoveCart,
    onSetLabel,
    onLinkMode,
    onColorChange,
    currentColor,
    defaultColor,
    onDefaultColor,
    toggleGaps,
    selectedGaps,
  } = props;
  const [listGaps, setListGaps] = useState([]);
  const [tooltip, setTooltip] = useState(false);
  const [labelEditPopover, setLabelEditPopover] = useState(false);

  const toggleTooltip = () => setTooltip((pre) => !pre);
  const toggleLabelEditPopover = () => setLabelEditPopover((pre) => !pre);
  const toggleArchive = () => {
    if (isMainInput) onSetArchive();
    else onChangeArchived();
  };

  async function getGaps() {
    try {
      const res = await API.graphql(graphqlOperation(listGapss));
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //  @ts-ignore
      const { items } = res.data.listGapss;

      setListGaps(items);
    } catch (err) {
      throw new Error('Get gaps route');
    }
  }

  useEffect(() => {
    getGaps();
  }, []);

  const toggleSelectedGap = useCallback((e) => {
    toggleGaps(e.target.value);
  }, []); 

  return (
    <>
      <div className={classNames(styles.input_navbar, !focused && styles.hide)}>
        <div className={styles.main_tools}>
          <button onClick={toggleArchive} type="button" className={styles.icon_btn}>
            <Icon name="dowland" color="premium" size="xs" />
          </button>
          <Popover
            placement="bottom-start"
            content={
              <div className={styles.colorWrapper}>
                {colors.map((color) => (
                  <button
                    type="button"
                    onClick={() => {
                      if (isMainInput) onDefaultColor(color.colorClass);
                      else onColorChange(color.colorClass);
                    }}
                    className={classNames(
                      color.colorClass,
                      isMainInput
                        ? color.colorClass === defaultColor && styles.active
                        : color.colorClass === currentColor && styles.active,
                    )}
                  >
                    {color.colorClass === 'default' && (
                      <Icon name="default-color" color="premium" size="xs" />
                    )}
                  </button>
                ))}
              </div>
            }
          >
            <button type="button" className={styles.icon_btn}>
              <Icon name="color-picer" color="premium" size="xs" />
            </button>
          </Popover>
          <Popover
            isOpen={labelEditPopover}
            content={
              <div className={classNames(styles.navbar_popover, styles.navbar_popover_settings)}>
                <ul className={styles.popover_content}>
                  {listGaps.length > 0 &&
                    listGaps.map((gap) => (
                      <li key={gap.id}>
                        <label>
                          <input
                            type="checkbox"
                            value={gap.title}
                            onClick={(e) => toggleSelectedGap(e)}
                            checked={selectedGaps.includes(gap.title)}
                          />
                          {gap.title}
                        </label>
                      </li>
                    ))}
                </ul>
              </div>
            }
            placement="bottom-start"
          >
            <button onClick={toggleLabelEditPopover} type="button" className={styles.icon_btn}>
              <Icon name="gaps" color="premium" size="xs" />
            </button>
          </Popover>
          <Popover
            isOpen={tooltip}
            content={
              <div className={classNames(styles.navbar_popover, styles.navbar_popover_settings)}>
                <ul className={styles.popover_content}>
                  {onRemoveCart && (
                    <li key="2" onClick={onRemoveCart}>
                      <span>Удалить карточку</span>
                    </li>
                  )}
                  <li
                    key="1"
                    onClick={() => {
                      onLinkMode();
                    }}
                  >
                    <span>Добавить линк</span>
                  </li>
                </ul>
              </div>
            }
            placement="bottom-start"
          >
            <button onClick={toggleTooltip} type="button" className={styles.icon_btn}>
              <Icon name="other" color="premium" size="xs" />
            </button>
          </Popover>

          {withHistory ? (
            <>
              <button
                style={{ position: 'relative', right: '3px' }}
                type="button"
                className={styles.icon_btn}
              >
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
    </>
  );
};
