import { FC, useState } from 'react';
import classNames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import styles from './Collabarator.module.scss';
import { Icon } from '../Icon/Icon';
import avatar from '../../assets/images/avatar.png';
import {
  setInputCollabaratorUsers,
  setCartCollabaratorUsers,
  toggleIsInputCollabaratorOpen,
  toggleIsCartCollabaratorOpen,
} from '../../reducers/collabarator';
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
      inputCollabaratorUsers: state.collabaratorReducer.inputCollabaratorUsers,
      cartCollabaratorUsers: state.collabaratorReducer.cartCollabaratorUsers,
    };
  });

  const { inputCollabaratorUsers, cartCollabaratorUsers } = mapStateToProps;

  const [users, setUsers] = useState<any>(
    isMainInput ? inputCollabaratorUsers : cartCollabaratorUsers,
  );
  const [value, setValue] = useState('');
  const dispatch = useDispatch();

  const save = () => {
    if (isMainInput) {
      dispatch(setInputCollabaratorUsers(users));
      dispatch(toggleIsInputCollabaratorOpen());
    } else {
      dispatch(setCartCollabaratorUsers(users));
      dispatch(toggleIsCartCollabaratorOpen());
      onChangeCollabarators();
    }
  };

  const cancel = () => {
    if (isMainInput) dispatch(toggleIsInputCollabaratorOpen());
    else dispatch(toggleIsCartCollabaratorOpen());
  };

  return (
    <div className={styles.collabarator}>
      <div className={styles.collabarator_header}>Collabarators</div>
      <div className={styles.user}>
        <img className={styles.user_img} src={avatar} />
        <div className={styles.user_text}>
          <span className={styles.user_title}> {localStorage.getItem('userEmail')} (Owner) </span>
        </div>
      </div>
      {users.map((user) => (
        <div className={styles.user}>
          <img className={styles.user_img} src={avatar} />
          <div className={styles.user_text}>
            <span className={styles.user_title}> {user} </span>
          </div>
        </div>
      ))}
      <div className={styles.user}>
        <div className={classNames(styles.user_img, styles.icon)}>
          <Icon name="add-accaunt" />
        </div>
        <div className={styles.user_text}>
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
            className={styles.user_confirm}
            name="done"
          />
        )}
      </div>
      <div className={styles.collabarator_footer}>
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
