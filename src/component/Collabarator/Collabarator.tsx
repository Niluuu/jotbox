import { FC, useState } from 'react';
import classNames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import styles from './Collabarator.module.scss';
import { Icon } from '../Icon/Icon';
import avatar from '../../assets/images/avatar.png';
import {
  setCollabaratorUsers,
  toggleIsCollabaratorOpen,
  toggleIsModalCollabaratorOpen,
  setCollabaratorModalUsers,
} from '../../reducers/collabaratorToggle';
import { RootState } from '../../app/store';

interface CollabaratorProps {
  isMainInput?: boolean;
  /**
   * Node collabarators change func
   */
  onChangeCollabarators?: () => void;
}
/**
 * Main Collabarator component for user interaction
 */
const Collabarator: FC<CollabaratorProps> = ({ isMainInput, onChangeCollabarators }) => {
  const mapStateToProps = useSelector((state: RootState) => {
    return {
      collabaratorUsers: state.collabaratorReducer.collabaratorUsers,
      collabaratorModalUsers: state.collabaratorReducer.collabaratorModalUsers,
    };
  });

  const { collabaratorUsers, collabaratorModalUsers } = mapStateToProps;

  const [users, setUsers] = useState<any>(isMainInput ? collabaratorUsers : collabaratorModalUsers);
  const [value, setValue] = useState('');
  const dispatch = useDispatch();

  const save = () => {
    if (isMainInput) {
      dispatch(setCollabaratorUsers(users));
      dispatch(toggleIsCollabaratorOpen());
    } else {
      dispatch(setCollabaratorModalUsers(users));
      dispatch(toggleIsModalCollabaratorOpen());
      onChangeCollabarators();
    }
  };

  const cancel = () => {
    if (isMainInput) dispatch(toggleIsCollabaratorOpen());
    else dispatch(toggleIsModalCollabaratorOpen());
  };
  return (
    <div className={styles.collabarator}>
      <div className={styles.header}>Collabarators</div>
      <div className={styles.item}>
        <img className={styles.img} src={avatar} />
        <div className={styles.text}>
          <span className={styles.title}> Saidumarova Nilufar (Owner) </span>
          {localStorage.getItem('userEmail')}
        </div>
      </div>
      {users.map((user) => (
        <div className={styles.item}>
          <img className={styles.img} src={avatar} />
          <div className={styles.text}>
            <span className={styles.title}> {user} </span>
          </div>
        </div>
      ))}
      <div className={styles.item}>
        <div className={classNames(styles.img, styles.icon)}>
          <Icon name="add-accaunt" />
        </div>
        <div className={styles.text}>
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            type="text"
            placeholder="Person or Email to share with"
          />
        </div>
        {value && (
          <Icon
            onClick={() => {
              setUsers([...users, value]);
              setValue('');
            }}
            className={styles.confirm}
            name="done"
          />
        )}
      </div>
      <div className={styles.footer}>
        <div>
          <button type="button" onClick={cancel}>
            Cancel
          </button>
          <button type="button" onClick={save}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default Collabarator;
