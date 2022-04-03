/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/require-default-props */
import { FC, useState, useEffect, useCallback } from 'react';
import classNames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import uniqid from 'uniqid';
import { API } from 'aws-amplify';
import styles from './MainInput.module.scss';
import { Icon } from '../Icon/Icon';
import Popover from '../popover/Popover';
import '../cart/Color.scss';
import { colors } from '../../utils/editor/color';
import { listLabels } from '../../graphql/queries';
import restrictDouble from '../../utils/restrictDouble/restrictDouble';
import {
  toggleIsInputCollabaratorOpen,
  toggleIsCartCollabaratorOpen,
} from '../../reducers/collabarator';
import { setUndo, setRedo } from '../../reducers/editor';

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
  selectedlabels: string[];
  /**
   * Toggle labels of Node function
   */
  togglelabelsCart?: (label: string) => void;
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
    selectedlabels,
    togglelabelsCart,
    shadow,
    isCart,
    onOpenModal,
  } = props;
  const userEmail = localStorage.getItem('userEmail');
  const collabarator = { eq: userEmail };

  const [listlabels, setListlabels] = useState([]);
  const [filter] = useState({ title: { contains: '' }, collabarator });
  const dispatch = useDispatch();

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

  const getlabels = useCallback(async () => {
    try {
      const res = await API.graphql({ query: listLabels, variables: { filter } });
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //  @ts-ignore
      const { items } = res.data.listLabels;
      // eslint-disable-next-line no-underscore-dangle
      const noneDeletedItems = items.filter((elm) => elm._deleted !== true);

      const filteredLabels = restrictDouble(noneDeletedItems);

      setListlabels(filteredLabels);
      return filteredLabels;
    } catch (err) {
      throw new Error('Get labels route');
    }
  }, [filter]);

  const onLabelFilter = useCallback(
    async (value: string) => {
      try {
        const data = await getlabels();
        const newlabels = data.filter((elm) =>
          elm.title.toLowerCase().includes(value.toLowerCase()),
        );

        setListlabels(newlabels);
      } catch (err) {
        throw new Error('Error filter by Letter');
      }
    },
    [getlabels],
  );

  useEffect(() => {
    getlabels();
  }, [getlabels, onLabelFilter]);

  const toggleSelectedlabel = useCallback(
    (e) => {
      if (isMainInput) togglelabels(e.target.value);
      else togglelabelsCart(e.target.value);
    },
    [isMainInput, togglelabels, togglelabelsCart],
  );

  const toggleCollabarator = () => {
    if (isMainInput) dispatch(toggleIsInputCollabaratorOpen());
    else {
      dispatch(toggleIsCartCollabaratorOpen());
      if (isCart) onOpenModal();
    }
  };

  return (
    <>
      <div className={classNames(styles.input_navbar, shadow && styles.shadow)}>
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
                      {listlabels.map((label) => (
                        <li key={label.id} className={styles.labelItems}>
                          <label>
                            <input
                              type="checkbox"
                              value={label.title}
                              onClick={(e) => toggleSelectedlabel(e)}
                              checked={selectedlabels.includes(label.title)}
                            />
                            {selectedlabels.includes(label.title) ? (
                              <Icon name="edit-bordered" color="premium" size="xs" />
                            ) : (
                              <Icon name="box" color="premium" size="xs" />
                            )}
                            <span> {label.title} </span>
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
