import { FC, useState, useRef, useEffect, useCallback, createRef } from 'react';
import { Link as UrlLink } from "react-router-dom"
import classNames from 'classnames';
import styles from './MainInput.module.scss';
import { Icon } from '../Icon/Icon';
import { InputNavbar } from './InputNavbar';

interface MainInputProps {
  isLogin?: boolean;
  gridType: boolean;
  onHyperLinkEditMode?: () => void;
  hyper: any;
  hyperLinkEditMode: boolean;
  textRef?: any;
  titleRef?: any;
  onSetCart: () => void;
  handleClickInside?: () => void;
  focused?: boolean;
  outsideRef?: any;
}

const MainInput: FC<MainInputProps> = ({ isLogin, titleRef, outsideRef, focused, handleClickInside, onHyperLinkEditMode, gridType, onSetCart, hyperLinkEditMode, hyper, textRef}) => {
  const [focus, setFocus] = useState(true);

  const onFocusOut = useCallback((e) => {
    if (e.currentTarget.contains(document.activeElement)) {
      console.log('focus out', e.currentTarget.contains(document.activeElement));
      // You can invoke a callback or add custom logic here
      // setFocus(false);
    }
  }, []);

  const onDelate = useCallback((e) => {
    console.log('delate chip');
  }, []);

  // cant set value from ref
  // useEffect(() => {
  //   console.log('id', ref.current.id);

  //   if (ref.current.id === 'title') {
  //     const title = ref.current.innerText;
  //     setNodeTitle(title);
  //   }

  //   if (ref.current.id === 'text') {
  //     const text = ref.current.innerText;
  //     console.log('text', text);
  //     setNodeText(text);
  //   }
  // }, [nodeText, nodeTitle]);

  const [edit, setEdit] = useState(true)
  return (
    <div className={classNames(styles.main_input, gridType? styles.grid4: null)}
      tabIndex={-1} onFocus={() => setFocus(true)} onBlur={(e) => onFocusOut(e)}
      onClick={handleClickInside} ref={outsideRef} >
      <div className={classNames(styles.main_header, focus ? styles.show : undefined)}>
        <div ref={titleRef} id="title" className={styles.textarea} contentEditable
          suppressContentEditableWarning aria-multiline role="textbox" spellCheck />
        <div className={styles.main_tools}>
          <button type="button" className={styles.icon_btn}>
            <Icon name="pin" color="premium" size="xs" />
          </button>
        </div>
      </div>
      <div className={styles.main_row}>
        <div id="text" ref={textRef} className={styles.textarea} role={styles.textbox} 
          contentEditable={edit} suppressContentEditableWarning onInput={(e) => console.log('e', e)}> 
          { hyper.map(hyp => 
            <> <a onClick={() => setEdit(false)} href={hyp.link} style={{color: "blue"}} > 
                { hyp.text } 
                </a> 
            </> )}
        </div>
      </div>
      { !focus ? (
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
      { focus ? <InputNavbar focused={focused} onHyperLinkEditMode={onHyperLinkEditMode} 
          ontoggle={() => onSetCart()} withHistory /> : null }
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
