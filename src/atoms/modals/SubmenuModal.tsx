/* eslint-disable react/require-default-props */
/* eslint-disable react/no-unused-prop-types */
import { FC, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
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
  onCreateLabel: (title: string) => void;
  onUpdateLabel: (title: string, id: string, version: number) => void;
  onDeleteLabel: (id: string, version: number) => void;
  close?: string;
  modalTitle?: string;
  listLabels: LabelType[];
}

export const SubmenuModal: FC<SubmenuModalProps> = ({
  isOpenLabel,
  toggleModal,
  onCreateLabel,
  onUpdateLabel,
  onDeleteLabel,
  listLabels,
  close,
  modalTitle,
  hasError,
}) => {
  const defaultModalTitle = modalTitle || 'edit labels';
  const defaultClose = close || 'done';
  const { t } = useTranslation();
  const [focus, setFocus] = useState(false);
  const [val, setVal] = useState('');

  const onCreateKeyup = (key: string) => {
    if (key === 'Enter') {
      onCreateLabel(val);
      setVal('');
    }
  };

  const mainRef = useRef(null);
  return (
    <Modal title={t(defaultModalTitle)} isOpen={isOpenLabel} toggleModal={toggleModal}>
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
          placeholder={t('create-new-label')}
          onFocus={() => setFocus(true)}
          onBlur={() => setTimeout(() => setFocus(false), 100)}
        />

        {focus || val.length > 0 ? (
          <Icon
            name="done"
            color="premium"
            size="xs"
            onClick={() => {
              if (val) onCreateLabel(val);
            }}
          />
        ) : null}
      </li>
      {hasError && <div className={styles.errorLabel}>{t('this-label-already-exists')}</div>}
      <div style={{ overflowY: 'scroll', height: '350px' }}>
        {listLabels &&
          listLabels.map(({ id, title, _version }) => {
            return (
              <Labels
                key={id}
                title={title}
                id={id}
                version={_version}
                onDeleteLabel={onDeleteLabel}
                onUpdateLabel={onUpdateLabel}
              />
            );
          })}
      </div>

      <div className={styles.bottom_btn}>
        <button type="button" onClick={toggleModal}>
          {defaultClose}
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
  onUpdateLabel: (title: string, id: string, version: number) => void;
  onDeleteLabel: (id: string, version: number) => void;
}

const Labels: FC<labelsProps> = ({ title, id, onUpdateLabel, onDeleteLabel, version }) => {
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
        onClick={() => onDeleteLabel(id, version)}
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
            onUpdateLabel(val, id, version);
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
