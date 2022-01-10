import { FC, useState, useEffect, useCallback } from 'react';
import classNames from 'classnames';
import { API } from 'aws-amplify';
import styles from '../HomePage/HomePage.module.scss';
import Modal from '../../component/modal/Modal';
import { Icon } from '../../component/Icon/Icon';
import ArchiveCartLayout from './ArchiveCartLayout';
import { listNodes } from '../../graphql/queries';

export interface ArchievePageProps {
  gridType?: boolean;
  setHyperLink?: (e: string) => void;
  setHyperText?: (e: string) => void;
  onCloseModal?: () => void;
  hyperLinkEditMode?: boolean;
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
  onChangeArchived,
  onChangePin,
  onRemoveCart,
  hyperLinkEditMode,
}) => {
  const userEmail = localStorage.getItem('userEmail');
  const collabarator = { eq: userEmail };
  const [textFocus, setTextFocus] = useState(false);
  const [linkFocus, setLinkFocus] = useState(false);
  const [nodes, setNodes] = useState([]);
  const [filter] = useState({ collabarator, archived: { eq: true } });

  const getAllNodes = useCallback(async () => {
    try {
      const data = await API.graphql({ query: listNodes, variables: { filter } });
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //  @ts-ignore
      const { items } = data.data.listNodes;
      setNodes(items);
      console.log(`items`, items);
    } catch (err) {
      throw new Error('Get Nodes Error');
    }
  }, [filter]);

  useEffect(() => {
    getAllNodes();
  }, []);

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
        carts={nodes}
        gridType={gridType}
        onColorChange={(e) => e}
      />
    </div>
  );
};

export default ArchievePage;
