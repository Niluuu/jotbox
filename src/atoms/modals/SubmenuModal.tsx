/* eslint-disable react/no-unused-prop-types */
import { FC, useCallback, useState, useRef } from 'react';
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

  const changeValName = (e) => {
    setVal(e.target.value);
  };

  const onCreateKeyup = (key: string) => {
    if (key === 'Enter') {
      onCreateGap(val);
      setVal('');
    }
  };

  const mainRef = useRef(null);
  return (
    <Modal title={modalTitle} isOpen={isOpenLabel} toggleModal={toggleModal}>
      <li className={styles.gaps}>
        {focus ? (
          <Icon
            name={focus ? 'exit' : 'add'}
            color="premium"
            size="xs"
            onMouseDown={() => setVal('')}
          />
        ) : (
          <Icon
            name="add"
            color="premium"
            size="xs"
            onClick={() => {
              mainRef.current.focus();
              setFocus(true);
            }}
          />
        )}
        <input
          ref={mainRef}
          type="text"
          value={val}
          onChange={changeValName}
          onKeyUp={(e) => onCreateKeyup(e.key)}
          placeholder="Create new label"
          onFocus={() => setFocus(true)}
          onBlur={() =>
            setTimeout(() => {
              setFocus(false);
            }, 100)
          }
        />

        {focus || val.length > 0 ? (
          <Icon
            name="done"
            color="premium"
            size="xs"
            onClick={() => {
              onCreateGap(val);
              changeValName('');
            }}
          />
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
  const [hover, setHover] = useState(false);

  const changeValName = (e) => setVal(e.target.value);

  const toggleHover = () => setHover((previous) => !previous);
  const localRef = useRef(null);
  return (
    <li onMouseEnter={toggleHover} onMouseLeave={toggleHover} className={styles.gaps}>
      <Icon
        name={hover ? 'delete' : 'filled-label'}
        color="premium"
        size="xs"
        className={styles.gaps_icon}
        onClick={() => onDeleteGap(id, version)}
      />
      <input
        ref={localRef}
        type="text"
        value={val}
        onChange={changeValName}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
      />
      {focus ? (
        <Icon
          onMouseDown={() => {
            onUpdateGap(val, id, version);
          }}
          name="done"
          color="premium"
          size="xs"
          className={styles.gaps_icon}
        />
      ) : (
        <Icon
          onClick={() => {
            localRef.current.focus();
            setFocus(true);
          }}
          name="edit"
          color="premium"
          size="xs"
          className={styles.gaps_icon}
        />
      )}
    </li>
  );
};
