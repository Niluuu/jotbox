/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/require-default-props */
import { FC, useState, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import Editor from '@draft-js-plugins/editor';
import { useParams } from 'react-router';
import { RootState } from '../../app/store';
import styles from './MainInput.module.scss';
import { Icon } from '../Icon/Icon';
import { InputNavbar } from './InputNavbar';
import MainEditor from '../../modules/Editor/MainEditor';
import useOnClickOutside from '../../utils/hooks/useOnClickOutside';
import { Chip } from '../chip/Chip';
import Collabarator from '../collabarator/Collabarator';
import Images from '../../atoms/modals/Images';
import { setEditorFocus } from '../../reducers/editor';

const MainInput: FC = () => {
  const linkRef = useRef<HTMLInputElement>(null);
  const textRef = useRef<HTMLInputElement>(null);
  const [linkMode, setlinkMode] = useState(false);
  const editorRef = useRef<Editor>(null);
  const titleRef = useRef<HTMLDivElement>();
  const [defaultPin, setDefaultPin] = useState(false);
  const [defaultColor, setDefaultColor] = useState('default');
  const [selectedLabels, setselectedLabels] = useState([]);

  const togglelabels = useCallback(
    (toggledLabel) => {
      setselectedLabels((pre) =>
        !pre.includes(toggledLabel)
          ? [...selectedLabels, toggledLabel]
          : selectedLabels.filter((elm) => elm !== toggledLabel),
      );
    },
    [selectedLabels],
  );

  const onSelectedLabels = useCallback(
    (elm) => {
      if (!selectedLabels.includes(elm)) setselectedLabels([elm, ...selectedLabels]);
    },
    [selectedLabels],
  );

  const onDefaultColor = useCallback((optionalColor) => {
    setDefaultColor(optionalColor);
  }, []);

  const [focused, setFocused] = useState(false);

  const onDefaultPin = useCallback(() => {
    setDefaultPin((pre) => !pre);
  }, []);

  const { label } = useParams();
  const dispatch = useDispatch();

  const [imgUrl, setImgUrl] = useState([]);

  const outsideRef = useRef(null);
  const handleClickOutside = () =>
    setTimeout(() => {
      setFocused(false);
    }, 350);

  const handleClickInside = () =>
    setTimeout(() => {
      if (label) onSelectedLabels(label);
      setFocused(true);
    }, 200);

  useOnClickOutside(outsideRef, handleClickOutside);

  const mapStateToProps = useSelector((state: RootState) => {
    return {
      grid: state.layoutGrid.grid,
      text: state.editorReducer.text,
      isInputCollabaratorOpen: state.collabaratorReducer.isInputCollabaratorOpen,
      inputCollabaratorUsers: state.collabaratorReducer.inputCollabaratorUsers,
    };
  });

  const { grid, text, isInputCollabaratorOpen , inputCollabaratorUsers } = mapStateToProps;

  const createLinkToEditor = () => {
    setlinkMode((prev) => !prev);
    dispatch(setEditorFocus());
  };

  const onKeyPressed = (e) => {
    if (e.keyCode === 13) {
      editorRef.current?.focus();
    }
  };

  const onLinkEditor = () => {
    if (textRef.current.value.length === 0) textRef.current.focus();
    else linkRef.current.focus();
    createLinkToEditor();
  };

  const cleanUpParent = useCallback(() => {
    titleRef.current.innerHTML = '';
    setDefaultPin(false);
    setDefaultColor('default');
    setselectedLabels([]);
    setsImg([]);
  }, []);

  const [img, setsImg] = useState([]);

  const onAddDefaultImage = useCallback(
    async (image: any): Promise<void> => {
      try {
        setsImg([...img, image]);
      } catch (err) {
        throw new Error('Update node error');
      }
    },
    [img],
  );

  const onAddDefaultImageInput = useCallback(
    (e) => {
      if (e.target.files.length > 0) {
        const image = e.target.files[0];

        onAddDefaultImage(image);

        const url = URL.createObjectURL(image);
        setImgUrl([...imgUrl, url]);

        setFocused(true);
      }
    },
    [imgUrl, onAddDefaultImage, setFocused],
  );

  return (
    <div
      onKeyUp={(e) => {
        if (e.key === 'Escape') handleClickOutside();
      }}
      className={classNames(
        styles.main_input,
        grid && styles.column,
        defaultColor,
        isInputCollabaratorOpen && styles.collabarator,
      )}
      tabIndex={-1}
      ref={outsideRef}
    >
      <Collabarator isOpen={!isInputCollabaratorOpen} isMainInput />
      <>
        {focused && imgUrl.length !== 0 && <Images images={imgUrl} />}
        <div
          className={classNames(styles.main_header, focused && styles.show)}
          style={{ display: isInputCollabaratorOpen && 'none' }}
        >
          <div
            ref={titleRef}
            id="title"
            className={styles.textarea}
            contentEditable
            suppressContentEditableWarning
            aria-multiline
            role="textbox"
            spellCheck
            onKeyDown={(e) => onKeyPressed(e)}
          />

          <button
            onClick={onDefaultPin}
            type="button"
            className={classNames(styles.defaultPin, styles.icon_btn)}
          >
            {!defaultPin ? (
              <Icon name="pin" color="premium" size="xs" />
            ) : (
              <Icon name="pin-black" color="premium" size="xs" />
            )}
          </button>
        </div>

        <div
          style={{ display: isInputCollabaratorOpen && 'none' }}
          className={styles.main_row}
          onFocus={handleClickInside}
          onClick={handleClickInside}
        >
          <MainEditor
            linkRef={linkRef}
            textRef={textRef}
            isMainInput
            defaultColor={defaultColor}
            linkMode={linkMode}
            createLinkToEditor={createLinkToEditor}
            editorRef={editorRef}
            initialState={text}
          />
        </div>
        {!focused ? (
          <div
            style={{ display: isInputCollabaratorOpen && 'none' }}
            className={classNames(styles.bottom_tools)}
          >
            <button type="button" className={styles.icon_btn}>
              <Icon name="edit-bordered" color="premium" size="xs" />
            </button>
            <button type="button" className={styles.icon_btn}>
              <Icon name="pen" color="premium" size="xs" />
            </button>
            <label style={{ cursor: 'pointer' }} className={styles.icon_btn}>
              <input
                style={{ display: 'none', cursor: 'pointer' }}
                type="file"
                onChange={(e) => onAddDefaultImageInput(e)}
              />
              <Icon name="img" color="premium" size="xs" />
            </label>
          </div>
        ) : null}
        {focused ? (
          <>
            {selectedLabels && (
              <div
                style={{ display: isInputCollabaratorOpen && 'none' }}
                className={classNames(styles.main_tools, styles.labels)}
              >
                {selectedLabels.map((labelChip) => (
                  <Chip
                    onDelate={() => {
                      if (label !== labelChip) togglelabels(labelChip);
                    }}
                  >
                    {labelChip}
                  </Chip>
                ))}
              </div>
            )}

            {inputCollabaratorUsers && (
              <div
                style={{ display: isInputCollabaratorOpen && 'none' }}
                className={classNames(styles.main_tools, styles.labels)}
              >
                {inputCollabaratorUsers.map((user) => (
                  <div className={styles.user}>{user[0].toLowerCase()}</div>
                ))}
              </div>
            )}

            <InputNavbar
              hide={isInputCollabaratorOpen}
              isMainInput
              createLinkToEditor={onLinkEditor}
              onDefaultColor={onDefaultColor}
              defaultColor={defaultColor}
              togglelabels={() => togglelabels}
              selectedLabels={selectedLabels}
              label={label}
              img={img}
              cleanUpParent={cleanUpParent}
              titleInnerText={titleRef.current.innerText}
              defaultPin={defaultPin}
            />
          </>
        ) : null}
      </>
    </div>
  );
};

export default MainInput;
