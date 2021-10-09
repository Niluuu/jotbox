import { FC, useState, useRef, useEffect, useCallback, createRef } from 'react';
import classNames from 'classnames';
import styles from './MainInput.module.scss';
import { Icon } from '../Icon/Icon';
import { InputNavbar } from './InputNavbar';
import { Chip } from '../chip/Chip';

interface MainInputProps {
  isLogin?: boolean;
  gridType: boolean;
  onOptionEditMode?: () => void;
  text: any;
  link: string;
  hyperLinkEditMode: boolean;
  textRef?: any;
  onSetCart: () => void;
}

const MainInput: FC<MainInputProps> = ({ isLogin, gridType, onSetCart, onOptionEditMode, hyperLinkEditMode, text, link, textRef}) => {
  const [focus, setFocus] = useState(true);
  const [nodeText, setNodeText] = useState('');
  const [nodeTitle, setNodeTitle] = useState('');
  const ref = createRef<HTMLDivElement>();
  const [show, setShow] = useState(false);

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

  return (
    <div
      className={classNames(styles.main_input, gridType? styles.grid4: null)}
      tabIndex={-1}
      onFocus={() => setFocus(true)}
      onBlur={(e) => onFocusOut(e)}
    >
      <div className={classNames(styles.main_header, focus ? styles.show : undefined)}>
        <div id="title" className={styles.textarea} contentEditable
          suppressContentEditableWarning aria-multiline role="textbox" spellCheck >
          {nodeText}
          <div>
            Bla bla{' '}
            <a target="_blank" rel="noreferrer" href="http://google.com"
              onClick={() => setShow(true)} >
              Google
            </a>{' '}
            {show ? <Link path="http://google.com" show={show} setShow={setShow} /> : null}
            Bla bla
          </div>
        </div>

        <div className={styles.main_tools}>
          <button type="button" className={styles.icon_btn}>
            <Icon name="pin" color="premium" size="xs" />
          </button>
        </div>
      </div>

      <div className={styles.main_row}>
        <div id="text" ref={textRef} className={styles.textarea} role={styles.textbox} contentEditable
          suppressContentEditableWarning onInput={(e) => console.log('e', e)}> 
          { text.map(hypo => {
            return <> <a href={`${hypo.link}`} style={{color: "blue"}} > {hypo.text} </a> &nbsp; </> } 
          )}
        </div>
      </div>
      <div className={styles.main_chips}>
        <Chip onDelate={onDelate} delateIcon>
          gap1aaaaaaaaaaaaaaaaaaaa
        </Chip>
        <Chip onDelate={onDelate} delateIcon>
          gap2
        </Chip>
      </div>
      {!focus ? (
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
      {focus ? <InputNavbar onSetCart={onSetCart} onOptionEditMode={onOptionEditMode} withHistory /> : null}
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
