import { FC, useCallback, useState } from 'react';
import styles from '../../modules/Sider/Sider.module.scss';
import { Icon } from '../Icon/Icon';
import Modal from '../modal/Modal';

export interface SubmenuModalProps {
  isOpenLabel: boolean;
  toggleModal: () => void;
  labels: any;
  gaps?: any;
  onReSetLabel: (oldValue, newValue) => void;
}

export const SubmenuModal: FC<SubmenuModalProps> = ({ gaps, isOpenLabel, onReSetLabel, labels, toggleModal }) => {
  const [focus, setFocus] = useState(false);
  const [val, setVal] = useState('');

  const changeValName = useCallback((e) => setVal(e.target.value), [val]);

  return (
    <Modal title="Изменение ярлыков" isOpen={isOpenLabel} labels={labels} toggleModal={toggleModal}>
      <li className={styles.gaps}>
        <Icon name={focus ? 'exit' : 'add'} color="premium" size="xs" onClick={() => setVal('')} />
        <input
          type="text"
          value={val}
          onChange={changeValName}
          placeholder="Create new label"
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
        />

        {focus ? <Icon name="done" color="premium" size="xs" /> : null}
      </li>
      {gaps[2].gaps.map((gap) => {
        return <Gaps name={gap.name} onReSetLabel={onReSetLabel} />;
      })}

      <div className={styles.bottom_btn}>
        <button type="button">Done</button>
      </div>
    </Modal>
  );
};

interface GapsProps {
  name: string;
  onReSetLabel: (oldValue, newValue) => void;
}

const Gaps: FC<GapsProps> = ({ name, onReSetLabel}) => {
  const [val, setVal] = useState(name);
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
        name={focus ? 'delete' : 'filled-label'}
        color="premium"
        size="xs"
        className={styles.gaps_icon}
      />
      <input
        type="text"
        value={val}
        defaultValue={name}
        onChange={changeValName}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
      />
      <Icon onClick={() => onReSetLabel(name, val)} name={focus ? 'done' : 'edit'} color="premium" size="xs" className={styles.gaps_icon} />
    </li>
  );
};
