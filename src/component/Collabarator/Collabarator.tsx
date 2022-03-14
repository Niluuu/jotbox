/* eslint-disable react/require-default-props */
import { FC, useState } from 'react';
import classNames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import styles from './Collabarator.module.scss';
import { Icon } from '../Icon/Icon';
import avatar from '../../assets/images/avatar.png';
import {
  setInputCollabaratorUsers,
  toggleIsInputCollabaratorOpen,
  toggleIsCartCollabaratorOpen,
} from '../../reducers/collabarator';
import { RootState } from '../../app/store';
import emailVerify from '../../utils/hooks/emailVerify';

interface CollabaratorProps {
  isMainInput?: boolean;
  /**
   * Node collabarators change func
   */
  onChangeCollabarators?: (collabarators: any) => void;
  cartCollabarators?: string[];
}
/**
 * Main Collabarator component for user interaction
 */
const Collabarator: FC<CollabaratorProps> = ({
  isMainInput,
  onChangeCollabarators,
  cartCollabarators,
}) => {
  const mapStateToProps = useSelector((state: RootState) => {
    return {
      inputCollabaratorUsers: state.collabaratorReducer.inputCollabaratorUsers,
    };
  });

  const { inputCollabaratorUsers } = mapStateToProps;

  const [users, setUsers] = useState<any>(isMainInput ? inputCollabaratorUsers : cartCollabarators);
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);
  const dispatch = useDispatch();

  const save = () => {
    if (isMainInput) {
      dispatch(setInputCollabaratorUsers(users));
      dispatch(toggleIsInputCollabaratorOpen());
    } else {
      onChangeCollabarators(users);
      dispatch(toggleIsCartCollabaratorOpen());
    }
  };

  const cancel = () => {
    if (isMainInput) dispatch(toggleIsInputCollabaratorOpen());
    else dispatch(toggleIsCartCollabaratorOpen());
  };

  const onConfirm = () => {
    const valid = emailVerify(value);
    if (valid) {
      setUsers([...users, value]);
      setValue('');
      setError(false);
    } else setError(true);
  };

  const onRemove = (user) => {
    setUsers(users.filter((elm) => elm !== user));
  };

  const userEmail = localStorage.getItem('userEmail');
  return (
    <div className={styles.collabarator}>
      <div className={styles.collabarator_header}>Collabarators</div>
      <div className={styles.user}>
        <img className={styles.user_img} src={avatar} />
        <div className={styles.user_text}>
          <span className={styles.user_title}> {userEmail} (Owner) </span>
        </div>
      </div>
      {users.map(
        (user) =>
          userEmail !== user && (
            <div className={styles.user}>
              <img className={styles.user_img} src={avatar} />
              <div className={styles.user_text}>
                <span className={styles.user_title}> {user} </span>
              </div>
              <Icon onClick={() => onRemove(user)} className={styles.user_confirm} name="exit" />
            </div>
          ),
      )}
      <div className={styles.user}>
        <div className={classNames(styles.user_img, styles.icon)}>
          <Icon name="add-accaunt" />
        </div>
        <div className={classNames(styles.user_text)}>
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            type="text"
            placeholder="Person or Email to share with"
          />
        </div>
        {value && <Icon onClick={onConfirm} className={styles.user_confirm} name="done" />}
      </div>
      {error && <div className={styles.message}>Please, Enter valid email address</div>}
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
