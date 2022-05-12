/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/require-default-props */
import { FC, useState, useEffect, useCallback } from 'react';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import styles from './MainInput.module.scss';
import { Icon } from '../Icon/Icon';
import Popover from '../popover/Popover';
import '../cart/Color.scss';
import COLORS from '../../utils/editor/color';
import {
  toggleIsInputCollabaratorOpen,
  toggleIsCartCollabaratorOpen,
} from '../../reducers/collabarator';
import { setUndo, setRedo } from '../../reducers/editor';
import { RootState } from '../../app/store';

interface InputNavbarProps {
  /**
   * Is main input navbar?
   */
  isMainInput?: boolean;
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
   * Node COLORS change func
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
   * Node initial labels
   */
  initiallabels?: string[];
  /**
   * Oncreate node toggleselected labels
   */
  togglelabels?: (label: string) => void;
  /**
   * Oncreate selected labels
   */
  selectedLabels: string[];
  /**
   * Toggle labels of Node function
   */
  toggleCartLabels?: (label: string) => void;
  /**
   * Is Modal? Should navbar has shadow in Modal?
   */
  shadow?: boolean;
  /**
   * Attr Link should not bee in carts
   */
  isCart?: boolean;
  /**
   * Open Cart Modal function
   */
  onOpenModal?: () => void;
  updateModalIsOpen?: boolean;
  hide?: boolean;
  label?: string;
}

export const InputNavbar: FC<InputNavbarProps> = (props) => {
  const {
    isMainInput,
    onChangeArchived,
    onSetArchive,
    onSetNode,
    onRemoveCart,
    createLinkToEditor,
    onColorChange,
    currentColor,
    defaultColor,
    onDefaultColor,
    togglelabels,
    selectedLabels,
    toggleCartLabels,
    shadow,
    isCart,
    onOpenModal,
    hide,
    label,
  } = props;
  const [labels, setLabels] = useState([]);
  const dispatch = useDispatch();

  const mapStateToProps = useSelector((state: RootState) => {
    return {
      storeLabels: state.labelReducer.storeLabels,
    };
  });

  const { storeLabels } = mapStateToProps;

  const undoRedo = (callBack: () => void) => {
    dispatch(callBack());
    setTimeout(() => dispatch(callBack()));
  };

  const handleEditorUndo = () => undoRedo(setUndo);

  const handleEditorRedo = () => undoRedo(setRedo);

  const toggleArchive = () => {
    if (isMainInput) onSetArchive();
    else onChangeArchived();
  };

  const onLabelFilter = useCallback(
    async (value: string) => {
      try {
        const newlabels = storeLabels.filter((elm) =>
          elm.title.toLowerCase().includes(value.toLowerCase()),
        );

        setLabels(newlabels);
      } catch (err) {
        throw new Error('Error filter by Letter');
      }
    },
    [storeLabels],
  );

  const toggleSelectedlabel = useCallback(
    (e) => {
      if (isMainInput) togglelabels(e.target.value);
      else toggleCartLabels(e.target.value);
    },
    [isMainInput, togglelabels, toggleCartLabels],
  );

  const toggleCollabarator = () => {
    if (isMainInput) dispatch(toggleIsInputCollabaratorOpen());
    else {
      dispatch(toggleIsCartCollabaratorOpen());
      if (isCart) onOpenModal();
    }
  };

  useEffect(() => {
    setLabels(storeLabels);
  }, [storeLabels]);

  return (
    <>
      <div
        style={{ display: hide && 'none' }}
        className={classNames(styles.input_navbar, shadow && styles.shadow)}
      >
        <div className={styles.main_tools}>
          <button onClick={toggleArchive} type="button" className={styles.icon_btn}>
            <Icon name="dowland" color="premium" size="xs" />
          </button>
          <button onClick={toggleCollabarator} type="button" className={styles.icon_btn}>
            <Icon name="user-add" color="premium" size="xs" />
          </button>
          <Popover
            placement="bottom-start"
            content={
              <div className={styles.colorWrapper}>
                {Object.values(COLORS).map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => {
                      if (isMainInput) onDefaultColor(color);
                      else onColorChange(color);
                    }}
                    className={classNames(
                      color,
                      isMainInput
                        ? color === defaultColor && styles.activeColor
                        : color === currentColor && styles.activeColor,
                    )}
                  >
                    {color === 'default' && <Icon name="default-color" color="premium" size="xs" />}
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
                      {labels.map((localLabel) => (
                        <li key={localLabel.id} className={styles.labelItems}>
                          <label>
                            <input
                              type="checkbox"
                              value={localLabel.title}
                              onClick={(e) => {
                                if (label !== localLabel.title) toggleSelectedlabel(e);
                              }}
                              checked={selectedLabels.includes(localLabel.title)}
                            />
                            {selectedLabels.includes(localLabel.title) ? (
                              <Icon name="edit-bordered" color="premium" size="xs" />
                            ) : (
                              <Icon name="box" color="premium" size="xs" />
                            )}
                            <span> {localLabel.title} </span>
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
              <Icon name="label" color="premium" size="xs" />
            </button>
          </Popover>
          {!isCart && (
            <button onClick={createLinkToEditor} type="button" className={styles.icon_btn}>
              <Icon name="addlink" color="premium" size="xs" />
            </button>
          )}
          {isMainInput && (
            <>
              <button onClick={handleEditorUndo} type="button" className={styles.icon_btn}>
                <Icon name="back" color="premium" size="xs" />
              </button>
              <button
                className={classNames(styles.icon_btn, styles.icon_rotate)}
                onClick={handleEditorRedo}
                type="button"
              >
                <Icon name="back" color="premium" size="xs" />
              </button>
            </>
          )}
          {!isMainInput && (
            <button onClick={onRemoveCart} type="button" className={classNames(styles.icon_btn)}>
              <Icon name="delete" color="premium" size="xs" />
            </button>
          )}
        </div>
        {(isMainInput || shadow) && (
          <button
            onClick={onSetNode}
            type="button"
            className={classNames(styles.btn, styles.close)}
          >
            Закрыть
          </button>
        )}
      </div>
    </>
  );
};
