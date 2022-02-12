import { FC, useState, useEffect, useCallback } from 'react';
import classNames from 'classnames';
import uniqid from 'uniqid';
import { API } from 'aws-amplify';
import styles from './MainInput.module.scss';
import { Icon } from '../Icon/Icon';
import Popover from '../popover/Popover';
import '../cart/Color.scss';
import { colors } from '../../utils/editor/color';
import { listGapss } from '../../graphql/queries';
import restrictDouble from '../../utils/restrictDouble/restrictDouble';

interface InputNavbarProps {
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
  /**
   * Toggle gaps of Node function
   */
  toggleGapsCart?: (gap: any) => void;
  /**
   * Is Modal? Should navbar has shadow in Modal?
   */
  shadow?: boolean;
}

export const InputNavbar: FC<InputNavbarProps> = (props) => {
  const {
    isMainInput,
    onChangeArchived,
    onSetArchive,
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
    toggleGapsCart,
    shadow,
  } = props;
  const [listGaps, setListGaps] = useState([]);
  const [filter, setFilter] = useState({ title: { contains: '' } });

  const toggleArchive = () => {
    if (isMainInput) onSetArchive();
    else onChangeArchived();
  };

  const getGaps = useCallback(async () => {
    try {
      const res = await API.graphql({ query: listGapss, variables: { filter } });
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //  @ts-ignore
      const { items } = res.data.listGapss;
      // eslint-disable-next-line no-underscore-dangle
      const noneDeletedItems = items.filter((elm) => elm._deleted !== true);

      const filteredLabels = restrictDouble(noneDeletedItems);

      setListGaps(filteredLabels);
      return filteredLabels;
    } catch (err) {
      throw new Error('Get gaps route');
    }
  }, [filter]);

  const onLabelFilter = useCallback(
    async (value: string) => {
      try {
        const data = await getGaps();
        const newGaps = data.filter((elm) => elm.title.toLowerCase().includes(value.toLowerCase()));

        setListGaps(newGaps);
      } catch (err) {
        throw new Error('Error filter by Letter');
      }
    },
    [getGaps],
  );

  useEffect(() => {
    getGaps();
  }, [getGaps, onLabelFilter]);

  const toggleSelectedGap = useCallback(
    (e) => {
      if (isMainInput) toggleGaps(e.target.value);
      else toggleGapsCart(e.target.value);
    },
    [isMainInput, toggleGaps, toggleGapsCart],
  );

  return (
    <>
      <div
        className={classNames(
          styles.input_navbar,
          !focused && styles.hide,
          shadow && styles.shadow,
        )}
      >
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
                        ? color.colorClass === defaultColor && styles.activeColor
                        : color.colorClass === currentColor && styles.activeColor,
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
            content={
              <div className={classNames(styles.navbar_popover, styles.navbar_popover_settings)}>
                <ul className={styles.popover_content}>
                  <div className={styles.labelWrapper}>
                    <h5> Добавить Ярлык </h5>
                    <div className={styles.labelSearch}>
                      <input
                        type="text"
                        onChange={(e) => onLabelFilter(e.currentTarget.value)}
                        placeholder="Введите Названия Ярлыка..."
                      />
                      <Icon size="min" name="search" />
                    </div>
                    <div className={styles.item}>
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
                  </div>
                </ul>
              </div>
            }
            placement="bottom-start"
          >
            <button type="button" className={styles.icon_btn}>
              <Icon name="gaps" color="premium" size="xs" />
            </button>
          </Popover>
          <Popover
            content={
              <div className={classNames(styles.navbar_popover, styles.navbar_popover_settings)}>
                <ul className={styles.popover_content}>
                  {onRemoveCart && (
                    <li
                      key={uniqid()}
                      onClick={onRemoveCart}
                    >
                      <span>Удалить карточку</span>
                    </li>
                  )}
                  <li
                    key={uniqid()}
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
            <button type="button" className={styles.icon_btn}>
              <Icon name="other" color="premium" size="xs" />
            </button>
          </Popover>
        </div>
        {(isMainInput || shadow) && (
          <button onClick={onSetNode} type="button" className={styles.btn}>
            Закрыть
          </button>
        )}
      </div>
    </>
  );
};
