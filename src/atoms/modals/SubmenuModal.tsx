import { FC, useCallback, useState } from 'react';
import styles from '../../modules/Sider/Sider.module.scss';
import { Icon } from '../../component/Icon/Icon';
import Modal from '../../component/modal/Modal';

export interface SubmenuModalProps {
  isOpenLabel: boolean;
  toggleModal: () => void;
  onCreateGap: (title: string) => void;
  onUpdateGap: (title: string, id: string, version: number) => void;
  onDeleteGap: (id: string, version: number) => void;
  close?: string;
  modalTitle?: string;
  listGaps: any;
}

export const SubmenuModal: FC<SubmenuModalProps> = ({
  isOpenLabel,
  toggleModal,
  onCreateGap,
  onUpdateGap,
  onDeleteGap,
  listGaps,
  close = 'Ok',
  modalTitle = 'Изменение ярлыков',
}) => {
  const [focus, setFocus] = useState(false);
  const [val, setVal] = useState('');

  const changeValName = useCallback((e) => setVal(e.target.value), []);

  return (
    <Modal title={modalTitle} isOpen={isOpenLabel} toggleModal={toggleModal}>
      <li className={styles.gaps}>
        {focus ? (
          // eslint-disable-next-line no-alert
          <Icon name="exit" color="premium" size="xs" onClick={() => alert('delate')} />
        ) : (
          <Icon name="add" color="premium" size="xs" onClick={() => setVal('')} />
        )}

        <input
          type="text"
          value={val}
          onChange={changeValName}
          placeholder="Create new label"
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
        />

        {focus || val.length > 0 ? (
          <Icon name="done" color="premium" size="xs" onClick={() => onCreateGap(val)} />
        ) : null}
      </li>
      <div style={{ overflowY: 'scroll', height: '50vh' }}>
        {listGaps &&
          listGaps.map(({ id, title, _version }) => {
            return (
              <Gaps
                key={id}
                title={title}
                id={id}
                version={_version}
                onDeleteGap={onDeleteGap}
                onUpdateGap={onUpdateGap}
              />
            );
          })}
      </div>

      <div className={styles.bottom_btn}>
        <button type="button" onClick={toggleModal}>
          {close}
        </button>
      </div>
    </Modal>
  );
};

interface GapsProps {
  key: string;
  id: string;
  title: string;
  version: number;
  onUpdateGap: (title: string, id: string, version: number) => void;
  onDeleteGap: (id: string, version: number) => void;
}

const Gaps: FC<GapsProps> = ({ title, id, onUpdateGap, onDeleteGap, version }) => {
  const [val, setVal] = useState(title);
  const [focus, setFocus] = useState(false);

  const changeValName = useCallback(
    (e) => {
      setVal(e.target.value);
    },
    [val],
  );

  return (
    <li className={styles.gaps}>
      <Icon
        // name={focus ? 'delete' : 'filled-label'}
        name="delete"
        color="premium"
        size="xs"
        className={styles.gaps_icon}
        onClick={() => onDeleteGap(id, version)}
      />
      <input
        type="text"
        value={val}
        onChange={changeValName}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
      />
      <Icon
        onClick={() => onUpdateGap(val, id, version)}
        name={focus ? 'done' : 'edit'}
        color="premium"
        size="xs"
        className={styles.gaps_icon}
      />
    </li>
  );
};
