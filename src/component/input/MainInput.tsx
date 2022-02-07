import { FC, useCallback, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import Editor from '@draft-js-plugins/editor';
import { RootState } from '../../app/store';
import styles from './MainInput.module.scss';
import { Icon } from '../Icon/Icon';
import { InputNavbar } from './InputNavbar';
import MainEditor from '../../modules/Editor/MainEditor';
import useOnClickOutside from '../../utils/hooks/useOnClickOutside';
import { Chip } from '../chip/Chip';

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
  selectedGaps?: string[];
  /**
   * Node labels handler
   */
  toggleGaps: (gap: string) => void;
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
  selectedGaps,
  toggleGaps,
}) => {
  const outsideRef = useRef(null);
  const handleClickOutside = () => setTimeout(() => setFocused(false), 350);
  const handleClickInside = () => setTimeout(() => setFocused(true), 200);
  useOnClickOutside(outsideRef, handleClickOutside);
  const editorRef = useRef<Editor>(null);

  const mapStateToProps = useSelector((state: RootState) => {
    return {
      grid: state.layoutGrid.grid,
      text: state.editorReducer.text,
    };
  });

  const { grid, text } = mapStateToProps;

  const onFocusOut = useCallback((e) => {
    if (e.currentTarget.contains(document.activeElement))
      return e.currentTarget.contains(document.activeElement);
  }, []);

  const [linkMode, setlinkMode] = useState(false);

  const createLinkToEditor = () => {
    setlinkMode((prev) => !prev);
  };

  const onKeyPressed = (e) => {
    if (e.keyCode === 13) {
      editorRef.current!.focus();
    }
  };

  return (
    <div
      className={classNames(styles.main_input, grid && styles.column, defaultColor)}
      tabIndex={-1}
      onFocus={handleClickInside}
      onBlur={(e) => onFocusOut(e)}
      onClick={handleClickInside}
      ref={outsideRef}
    >
      <div className={classNames(styles.main_header, focused && styles.show)}>
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

        <button onClick={onDefaultPin} type="button" className={styles.icon_btn}>
          {!defaultPin ? (
            <Icon name="pin" color="premium" size="xs" />
          ) : (
            <Icon name="pin-black" color="premium" size="xs" />
          )}
        </button>
      </div>

      <div className={styles.main_row}>
        <MainEditor
          isMainInput
          defaultColor={defaultColor}
          linkMode={linkMode}
          createLinkToEditor={createLinkToEditor}
          editorRef={editorRef}
          initialState={text}
        />
      </div>
      {!focused ? (
        <div className={classNames(styles.main_tools, styles.bottom_tools)}>
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

      {focused && selectedGaps && (
        <div className={classNames(styles.main_tools, styles.gaps)}>
          {selectedGaps.map((gap) => (
            <Chip>{gap} </Chip>
          ))}
        </div>
      )}

      {focused ? (
        <InputNavbar
          isMainInput
          focused={focused}
          onSetArchive={onSetArchive}
          onSetNode={() => onSetNodes()}
          createLinkToEditor={createLinkToEditor}
          onDefaultColor={onDefaultColor}
          defaultColor={defaultColor}
          toggleGaps={toggleGaps}
          selectedGaps={selectedGaps}
        />
      ) : null}
    </div>
  );
};

export default MainInput;
