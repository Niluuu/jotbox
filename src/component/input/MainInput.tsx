import { FC, useState, useCallback } from 'react';
import classNames from 'classnames';
import styles from './MainInput.module.scss';
import { Icon } from '../Icon/Icon';
import { InputNavbar } from './InputNavbar';

interface MainInputProps {
  gridType: boolean;
  onHyperLinkEditMode?: () => void;
  hyper: any;
  hyperLinkEditMode: boolean;
  textRef?: any;
  titleRef?: any;
  onSetCart: () => void;
}

const MainInput: FC<MainInputProps> = ({ titleRef, onHyperLinkEditMode, gridType, onSetCart, hyper, textRef}) => {
  const [focus, setFocus] = useState(true);

  return (
    <div
      className={classNames(styles.main_input, gridType? styles.grid4: null)}
      tabIndex={-1}
      onFocus={() => setFocus(true)}
    >
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
        <div id="text" ref={textRef} className={styles.textarea} role={styles.textbox} contentEditable
          suppressContentEditableWarning onInput={(e) => console.log('e', e)}> 
          { hyper.map(h => {
            return <> <a href={`${h.link}`} style={{color: "blue"}} > {h.text} </a> </> } 
          )}
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
      {focus ? <InputNavbar onHyperLinkEditMode={onHyperLinkEditMode} ontoggle={() => onSetCart()} withHistory /> : null}
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
