import { FC, useRef, useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import classNames from 'classnames';
import { RootState } from '../../app/store';
import styles from './MainInput.module.scss';
import { Icon } from '../Icon/Icon';
import { InputNavbar } from './InputNavbar';
import useOnClickOutside from '../../utils/hooks/useOnClickOutside';
import MainEditor from '../../modules/Editor/MainEditor';

interface MainInputProps {
  focused: boolean;
  defaultPin: boolean;
  onDefaultPin: () => void;
  onSetCart: () => void;
  onSetArchive: () => void;
  setFocused: (e: any) => void;
  outsideRef?: any;
  onSetIsMain?: (e: boolean) => void;
}

const MainInput: FC<MainInputProps> = ({
  onSetArchive,
  defaultPin,
  onDefaultPin,
  setFocused,
  focused,
  onSetCart,
  onSetIsMain,
}) => {
  const outsideRef = useRef(null);
  const handleClickOutside = () => setTimeout(() => setFocused(false), 350);
  const handleClickInside = () => setTimeout(() => setFocused(true), 200);
  const mapStateToProps = useSelector((state: RootState) =>  {
    return state.layoutGridTypeReducer
  });
  
  useOnClickOutside(outsideRef, handleClickOutside);

  const onFocusOut = useCallback((e) => {
    if (e.currentTarget.contains(document.activeElement)) {
      console.log('focus out', e.currentTarget.contains(document.activeElement));
    }
  }, []);

  const { grid } = mapStateToProps
  
  const titleRef = useRef<HTMLDivElement>()
  const [focusEdit, setFocusEdit] = useState(false)

  const onKeyFocus = (key) => {
    if (key === "Enter") {
      titleRef.current.blur()
      setFocusEdit((prev) => !prev)
      setTimeout(() => setFocusEdit((prev) => !prev), 100);
    }
  }
  return (
    <div
      className={classNames(styles.main_input, grid && styles.column)}
      tabIndex={-1}
      onFocus={handleClickInside}
      onBlur={(e) => onFocusOut(e)}
      onClick={handleClickInside}
      ref={outsideRef}
    >
      <div className={classNames(styles.main_header, focused && styles.show)}>
        <div className={styles.main_tools}>
          <button onClick={onDefaultPin} type="button" className={styles.icon_btn}>
            {!defaultPin ? (
              <Icon name="pin" color="premium" size="xs" />
            ) : (
              <Icon name="pin-black" color="premium" size="xs" />
            )}
          </button>
        </div>
      </div>
      <div className={styles.main_row}>
      <div 
        ref={titleRef} 
        id="title" 
        className={styles.textarea} contentEditable
        onKeyUp={(e) => {
          onKeyFocus(e.key)
        }}
        suppressContentEditableWarning 
        aria-multiline 
        role="textbox" 
        spellCheck />
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
      { focused ? 
        <div className={styles.main_toolbar}>
          <MainEditor focusEdit={focusEdit} onSetArchive={onSetArchive} />
          <div className={styles.additional}>
            <InputNavbar
              focused={focused}
              isMainInput={!!true}
              isEditor={!true}
              onSetArchive={onSetArchive}
              ontoggle={() => onSetCart()}
              onSetIsMain={onSetIsMain}
              withHistory
            />
          </div>
        </div> : null}
    </div>
  );
};

interface LinkProps {
  path: string;
  show?: boolean;
  setShow: (boolean) => void;
}

const Link: FC<LinkProps> = ({ show, path, setShow }) => {
  const handleClick = useCallback(
    (e) => {
      setShow(false);
    },
    [show],
  );

  return (
    <div className={classNames(styles.toltip, show && styles.show)}>
      <a href={path} onClick={() => handleClick(path)}>
        <Icon name="link" />
        Открыть ссылку
      </a>
    </div>
  );
};

export default MainInput;
