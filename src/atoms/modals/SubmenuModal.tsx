/* eslint-disable react/no-unused-prop-types */
import { FC, useCallback, useState, useRef } from 'react';
import styles from '../../modules/Sider/Sider.module.scss';
import { Icon } from '../../component/Icon/Icon';
import Modal from '../../component/modal/Modal';

type LabelType = {
  id: string;
  _version: number;
  title: string;
};

export interface SubmenuModalProps {
  isOpenLabel: boolean;
  hasError: boolean;
  toggleModal: () => void;
  onCreatelabel: (title: string) => void;
  onUpdatelabel: (title: string, id: string, version: number) => void;
  onDeletelabel: (id: string, version: number) => void;
  close?: string;
  modalTitle?: string;
  listlabels: LabelType[];
}

export const SubmenuModal: FC<SubmenuModalProps> = ({
  isOpenLabel,
  toggleModal,
  onCreatelabel,
  onUpdatelabel,
  onDeletelabel,
  listlabels,
  close = 'Done',
  modalTitle = 'Изменение ярлыков',
  hasError,
}) => {
  const [focus, setFocus] = useState(false);
  const [val, setVal] = useState('');

  const onCreateKeyup = (key: string) => {
    if (key === 'Enter') {
      onCreatelabel(val);
      setVal('');
    }
  };

  const mainRef = useRef(null);
  return (
    <Modal title={modalTitle} isOpen={isOpenLabel} toggleModal={toggleModal}>
      <li className={styles.labels}>
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
          onChange={(e) => setVal(e.currentTarget.value)}
          onKeyUp={(e) => onCreateKeyup(e.key)}
          placeholder="Create new label"
          onFocus={() => setFocus(true)}
          onBlur={() => setTimeout(() => setFocus(false), 100)}
        />

        {focus || val.length > 0 ? (
          <Icon name="done" color="premium" size="xs" onClick={() => onCreatelabel(val)} />
        ) : null}
      </li>
      {hasError && <div className={styles.errorLabel}>This label already exists. Rename it!</div>}
      <div style={{ overflowY: 'scroll', height: '350px' }}>
        {listlabels &&
          listlabels.map(({ id, title, _version }) => {
            return (
              <Labels
                key={id}
                title={title}
                id={id}
                version={_version}
                onDeletelabel={onDeletelabel}
                onUpdatelabel={onUpdatelabel}
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

interface labelsProps {
  key: string;
  id: string;
  title: string;
  version: number;
  onUpdatelabel: (title: string, id: string, version: number) => void;
  onDeletelabel: (id: string, version: number) => void;
}

const Labels: FC<labelsProps> = ({ title, id, onUpdatelabel, onDeletelabel, version }) => {
  const [val, setVal] = useState(title);
  const [focus, setFocus] = useState(false);
  const [hover, setHover] = useState(false);

  const changeValName = (e) => setVal(e.target.value);

  const toggleHover = () => setHover((previous) => !previous);
  const localRef = useRef(null);
  return (
    <li onMouseEnter={toggleHover} onMouseLeave={toggleHover} className={styles.labels}>
      <Icon
        name={hover ? 'delete' : 'filled-label'}
        color="premium"
        size="xs"
        className={styles.labels_icon}
        onClick={() => onDeletelabel(id, version)}
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
            onUpdatelabel(val, id, version);
          }}
          name="done"
          color="premium"
          size="xs"
          className={styles.labels_icon}
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
          className={styles.labels_icon}
        />
      )}
    </li>
  );
};
