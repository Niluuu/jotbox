import { FC, useState, useRef, useEffect, useCallback, createRef } from 'react';
import { Link as UrlLink } from 'react-router-dom';
import classNames from 'classnames';
import styles from './MainInput.module.scss';
import { Icon } from '../Icon/Icon';
import { InputNavbar } from './InputNavbar';
import useOnClickOutside from '../../utils/hooks/useOnClickOutside';

interface MainInputProps {
  isLogin?: boolean;
  gridType: boolean;
  onHyperLinkEditMode?: () => void;
  hyper: any;
  hyperLinkEditMode: boolean;
  textRef?: any;
  titleRef?: any;
  focused: boolean;
  defaultPin: boolean;
  onDefaultPin: () => void;
  onSetCart: () => void;
  onSetArchive: () => void;
  setFocused: (i: any) => void;
  outsideRef?: any;
}

const MainInput: FC<MainInputProps> = ({
  isLogin,
  onSetArchive,
  defaultPin,
  onDefaultPin,
  setFocused,
  focused,
  titleRef,
  onHyperLinkEditMode,
  gridType,
  onSetCart,
  hyperLinkEditMode,
  hyper,
  textRef,
}) => {
  const outsideRef = useRef(null);

  const handleClickOutside = () => setTimeout(() => setFocused(false), 250);
  const handleClickInside = () => setTimeout(() => setFocused(true), 250);

  useOnClickOutside(outsideRef, handleClickOutside);

  const onFocusOut = useCallback((e) => {
    if (e.currentTarget.contains(document.activeElement)) {
      console.log('focus out', e.currentTarget.contains(document.activeElement));
      // You can invoke a callback or add custom logic here
      // setFocus(false);
    }
  }, []);

  const [edit, setEdit] = useState(true);
  return (
    <div
      className={classNames(styles.main_input, gridType ? styles.grid4 : null)}
      tabIndex={-1}
      onFocus={() => setFocused(true)}
      onBlur={(e) => onFocusOut(e)}
      onClick={handleClickInside}
      ref={outsideRef}
    >
      <div className={classNames(styles.main_header, focused ? styles.show : undefined)}>
        <div
          ref={titleRef}
          id="title"
          className={styles.textarea}
          contentEditable
          suppressContentEditableWarning
          aria-multiline
          role="textbox"
          spellCheck
        />
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
          id="text"
          ref={textRef}
          className={styles.textarea}
          role={styles.textbox}
          contentEditable={edit}
          suppressContentEditableWarning
          onInput={(e) => console.log('e', e)}
        >
          {hyper.map((hyp) => (
            <>
              {' '}
              <a onClick={() => setEdit(false)} href={hyp.link} style={{ color: 'blue' }}>
                {hyp.text}
              </a>
            </>
          ))}
        </div>
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
      {focused ? (
        <InputNavbar
          focused={focused}
          onHyperLinkEditMode={onHyperLinkEditMode}
          isMainInput={!!true}
          onSetArchive={onSetArchive}
          ontoggle={() => onSetCart()}
          withHistory
        />
      ) : null}
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
