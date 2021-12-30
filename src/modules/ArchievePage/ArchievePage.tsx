import { FC, useState} from 'react';
import classNames from 'classnames';
import styles from '../HomePage/HomePage.module.scss';
import Modal from '../../component/modal/Modal';
import { Icon } from '../../component/Icon/Icon';
import ArchiveCartLayout from './ArchiveCartLayout';

interface CartProps {
  id: string;
  title: string;
  description: any;
  pined: boolean;
  archived: boolean;
  gaps: string[];
  _version: number;
  color: string;
}

export interface ArchievePageProps {
  gridType?: boolean;
  setHyperLink?: (e: string) => void;
  setHyperText?: (e: string) => void;
  onCloseModal?: () => void;
  hyperLinkEditMode?: boolean;
  carts?: CartProps[];
  onRemoveCart?: (id: string) => void;
  onChangeArchived?: (id: string, title: string, description: string) => void;
  onChangePin?: (id: string, pined: boolean) => void;
  hyperText?: string;
  hyperLink?: string;
}

const ArchievePage: FC<ArchievePageProps> = ({
  gridType,
  setHyperLink,
  setHyperText,
  hyperText,
  hyperLink,
  onCloseModal,
  carts,
  onChangeArchived,
  onChangePin,
  onRemoveCart,
  hyperLinkEditMode,
}) => {
  const [textFocus, setTextFocus] = useState(false);
  const [linkFocus, setLinkFocus] = useState(false);

  const onColorChange = () => {
    console.log('ok')
  }

  return (
    <div className={classNames(styles.home_page, gridType && styles.column)}>
      <div className={styles.home_page__main_input}>
        <Modal title="Добавить линк" isOpen={hyperLinkEditMode} toggleModal={onCloseModal}>
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
          <div className={styles.bottom_btn}>
            <button type="button">Done</button>
          </div>
        </Modal>
      </div>
      <ArchiveCartLayout
        onChangeArchived={onChangeArchived}
        onChangePin={onChangePin}
        onRemoveCart={onRemoveCart}
        carts={carts}
        gridType={gridType}
        onColorChange={onColorChange}
      />
    </div>
  );
};

export default ArchievePage;
