import { FC, useState } from 'react';
import styles from '../../modules/HomePage/HomePage.module.scss';
import Modal from '../../component/modal/Modal';
import { Icon } from '../../component/Icon/Icon';

const AddLinkModal: FC = () => {
  const [textFocus, setTextFocus] = useState(false);
  const [linkFocus, setLinkFocus] = useState(false);
  const [hyperLinkEditMode, setHyperLinkEditMode] = useState(false);
  const [hyperText, setHyperText] = useState('');
  const [hyperLink, setHyperLink] = useState('');

  const onHyperLinkEditMode = () => {
    setHyperLinkEditMode((pre) => !pre);
  };

  const onCloseModal = () => {
    setHyperLinkEditMode(false);
    setTimeout(() => {
      setHyperText('');
      setHyperLink('');
    }, 200);
  };

  return (
    <Modal title="Добавить линк" isTop isOpen={hyperLinkEditMode} toggleModal={onCloseModal}>
      <div className={styles.gaps}>
        <Icon name={textFocus ? 'exit' : 'add'} color="premium" size="xs" />
        <input
          type="text"
          value={hyperText}
          onChange={(e) => setHyperText(e.currentTarget.value)}
          placeholder="Введите текст..."
          onFocus={() => setTextFocus(true)}
          onBlur={() => setTextFocus(false)}
        />
        {textFocus && <Icon name="done" color="premium" size="xs" />}
      </div>
      <div className={styles.gaps}>
        <Icon name={linkFocus ? 'exit' : 'add'} color="premium" size="xs" />
        <input
          type="text"
          value={hyperLink}
          onChange={(e) => setHyperLink(e.currentTarget.value)}
          placeholder="Введите линк..."
          onFocus={() => setLinkFocus(true)}
          onBlur={() => setLinkFocus(false)}
        />
        {linkFocus && <Icon name="done" color="premium" size="xs" />}
      </div>
      <div className={styles.bottom_btn} onClick={onHyperLinkEditMode}>
        <button type="button">Done</button>
      </div>
    </Modal>
  );
};

export default AddLinkModal;
