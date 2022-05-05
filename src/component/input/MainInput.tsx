/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/require-default-props */
import { FC, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
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
import Collabarator from '../Collabarator/Collabarator';

interface MainInputProps {
  /**
   * Is main input focused
   */
  focused: boolean;
  /**
   * Is main input creates pined node
   */
  defaultPin: boolean;
  /**
   * Outside ref
   */
  outsideRef?: React.LegacyRef<HTMLDivElement> | null;
  /**
   * Node title
   */
  titleRef: React.LegacyRef<HTMLDivElement> | null;
  /**
   * Default node color
   */
  defaultColor?: string;
  /**
   * Set default pined attribut when creating Node
   */
  onDefaultPin: () => void;
  /**
   * Creating Node
   */
  onSetNodes: () => void;
  /**
   * Create default archived Node
   */
  onSetArchive: () => void;
  /**
   * Set default color when creating Node
   */
  onDefaultColor?: (optionalColor: string) => void;
  /**
   * Outside click handler
   */
  setFocused: (e: boolean) => void;
  /**
   * Default node labels
   */
  selectedLabels?: string[];
  /**
   * Node labels handler
   */
  togglelabels: (label: string) => void;
  onSelectedLabels?: (label: string) => void;
}

const MainInput: FC<MainInputProps> = ({
  onSetArchive,
  defaultPin,
  onDefaultPin,
  setFocused,
  focused,
  onSetNodes,
  titleRef,
  defaultColor,
  onDefaultColor,
  selectedLabels,
  togglelabels,
  onSelectedLabels,
}) => {
  const linkRef = useRef<HTMLInputElement>(null);
  const textRef = useRef<HTMLInputElement>(null);
  const [linkMode, setlinkMode] = useState(false);
  const editorRef = useRef<Editor>(null);
  const { label } = useParams();

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

  const { grid, text, isInputCollabaratorOpen, inputCollabaratorUsers } = mapStateToProps;

  const createLinkToEditor = () => {
    setlinkMode((prev) => !prev);
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
      onFocus={handleClickInside}
      onClick={handleClickInside}
      ref={outsideRef}
    >
      <Collabarator isOpen={!isInputCollabaratorOpen} isMainInput />
      <>
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

        <div style={{ display: isInputCollabaratorOpen && 'none' }} className={styles.main_row}>
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
            <button type="button" className={styles.icon_btn}>
              <Icon name="img" color="premium" size="xs" />
            </button>
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
              onSetArchive={onSetArchive}
              onSetNode={() => onSetNodes()}
              createLinkToEditor={onLinkEditor}
              onDefaultColor={onDefaultColor}
              defaultColor={defaultColor}
              togglelabels={() => togglelabels}
              selectedLabels={selectedLabels}
              label={label}
            />
          </>
        ) : null}
      </>
    </div>
  );
};

export default MainInput;
