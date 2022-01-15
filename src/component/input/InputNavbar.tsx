import { FC, useState, useEffect, useCallback } from 'react';
import classNames from 'classnames';
import { API, graphqlOperation } from 'aws-amplify';
import styles from './MainInput.module.scss';
import { Icon } from '../Icon/Icon';
import Popover from '../popover/Popover';
import '../cart/Color.scss';
import { colors } from '../../utils/editor/color';
import { listGapss } from '../../graphql/queries';

interface InputNavbarProps {
  withHistory?: boolean;
  /**
   * Is main input navbar?
   */
  isMainInput?: boolean;
  /**
   * Is main input cliked
   */
  focused?: boolean;
  /**
   * Create node func
   */
  onSetNode?: () => void;
  /**
   * Node remove func
   */
  onRemoveCart?: () => void;
  /**
   * Archived node func
   */
  onSetArchive?: () => void;
  /**
   * Node toggle archived func
   */
  onChangeArchived?: () => void;
  /**
   * Create link text to editor
   */
  createLinkToEditor?: () => void;
  /**
   * Node colors change func
   */
  onColorChange?: (color: string) => void;
  /**
   * Node current color
   */
  currentColor?: string;
  /**
   * Node pre color
   */
  defaultColor?: string;
  /**
   * Node set defoult color func
   */
  onDefaultColor?: (optionalColor: string) => void;
  /**
   * Node initial gaps
   */
  initialGaps?: string[];
  /**
   * Oncreate node toggleselected gaps
   */
  toggleGaps?: (gap: string) => void;
  /**
   * Oncreate selected gaps
   */
  selectedGaps: string[];
}

export const InputNavbar: FC<InputNavbarProps> = (props) => {
  const {
    isMainInput,
    onChangeArchived,
    onSetArchive,
    withHistory,
    onSetNode,
    focused = true,
    onRemoveCart,
    createLinkToEditor,
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

  const [filter, setFilter] = useState({ title: { contains: '' } });

  const getGaps = useCallback(async () => {
    try {
      const res = await API.graphql({ query: listGapss, variables: { filter } });
      // const res = await API.graphql({ query: listGapss });
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //  @ts-ignore
      const { items } = res.data.listGapss;

      const newLabels = new Set();
      const filteredLabels = items.filter((label) => {
        const duplicate = newLabels.has(label.title);
        newLabels.add(label.title);
        return !duplicate;
      });

      setListGaps(filteredLabels);
    } catch (err) {
      throw new Error('Get gaps route');
    }
  }, [filter]);

  const onLabelFilter = useCallback((value: string) => {
    setFilter(() => ({ title: { contains: value } }));
  }, []);

  useEffect(() => {
    getGaps();
  }, [getGaps, onLabelFilter]);

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
                  <div className={styles.labelWrapper}>
                    <h5> Добавить Ярлык </h5>
                    <div className={styles.labelSearch}>
                      <input 
                        type="text" 
                        onChange={(e) => onLabelFilter(e.currentTarget.value)}
                        placeholder="Введите Названия Ярлыка..." />
                      <Icon size="min" name="search" />
                    </div>
                    {listGaps.map((gap) => (
                      <li key={gap.id} className={styles.labelGap}>
                        <label>
                          <input
                            type="checkbox"
                            value={gap.title}
                            onClick={(e) => toggleSelectedGap(e)}
                            checked={selectedGaps.includes(gap.title)}
                          />
                          {selectedGaps.includes(gap.title) ? (
                            <Icon name="edit-bordered" color="premium" size="xs" />
                          ) : (
                            <Icon name="box" color="premium" size="xs" />
                          )}
                          <span> {gap.title} </span>
                        </label>
                      </li>
                    ))}
                  </div>
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
                      createLinkToEditor();
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
        <button onClick={onSetNode} type="button" className={styles.btn}>
          Закрыть
        </button>
      </div>
    </>
  );
};
