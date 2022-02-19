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
  const linkRef = useRef(null);
  const [linkMode, setlinkMode] = useState(false);
  const editorRef = useRef<Editor>(null);

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
      editorRef.current!.focus();
    }
  };

  const onLinkEditor = () => {
    linkRef.current.focus();
    createLinkToEditor();
  };

  return (
    <div
      className={classNames(styles.main_input, grid && styles.column, defaultColor)}
      tabIndex={-1}
    >
      {isInputCollabaratorOpen ? (
        <Collabarator isMainInput />
      ) : (
        <>
          <div className={classNames(styles.main_header, styles.show)}>
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
              linkRef={linkRef}
              isMainInput
              defaultColor={defaultColor}
              linkMode={linkMode}
              createLinkToEditor={createLinkToEditor}
              editorRef={editorRef}
              initialState={text}
            />
          </div>

          {selectedGaps && (
            <div className={classNames(styles.main_tools, styles.gaps)}>
              {selectedGaps.map((gap) => (
                <Chip>{gap}</Chip>
              ))}
            </div>
          )}

          {inputCollabaratorUsers && (
            <div className={classNames(styles.main_tools, styles.gaps)}>
              {inputCollabaratorUsers.map((user) => (
                <div className={styles.user}>{user[0].toUpperCase()}</div>
              ))}
            </div>
          )}

          <InputNavbar
            isMainInput
            onSetArchive={onSetArchive}
            onSetNode={() => onSetNodes()}
            createLinkToEditor={onLinkEditor}
            onDefaultColor={onDefaultColor}
            defaultColor={defaultColor}
            toggleGaps={toggleGaps}
            selectedGaps={selectedGaps}
          />
        </>
      )}
    </div>
  );
};

export default MainInput;
