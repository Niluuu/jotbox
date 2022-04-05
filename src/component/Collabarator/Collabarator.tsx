/* eslint-disable react/require-default-props */
import { FC, useState, useCallback } from 'react';
import classNames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import { API } from 'aws-amplify';
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
import { listNodes } from '../../graphql/queries';
import { NodeLink } from '../../utils/editor/NodeLink';

interface CartProps {
  id: string;
  title: string;
  description: string;
  pined: boolean;
  archived: boolean;
  labels: string[];
  _version: number;
  _deleted: boolean;
  color: string;
  collabarators: string[];
  collabarator: string;
}

interface CollabaratorProps {
  isMainInput?: boolean;
  isOpen?: boolean;
  /**
   * Node collabarators change func
   */
  onChangeCollabarators?: (collabarators: string[]) => void;
  cartCollabarators?: string[];
}
/**
 * Main Collabarator component for user interaction
 */
const Collabarator: FC<CollabaratorProps> = ({
  isMainInput,
  onChangeCollabarators,
  cartCollabarators,
  isOpen,
}) => {
  const mapStateToProps = useSelector((state: RootState) => {
    return {
      inputCollabaratorUsers: state.collabaratorReducer.inputCollabaratorUsers,
    };
  });

  const { inputCollabaratorUsers } = mapStateToProps;

  const userEmail = localStorage.getItem('userEmail');
  const collabarators = { contains: userEmail };
  const [filter] = useState({ collabarators });

  const [users, setUsers] = useState(isMainInput ? inputCollabaratorUsers : cartCollabarators);
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);
  const dispatch = useDispatch();

  const [suggestions, setSuggestions] = useState([]);

  const getAllNodes = useCallback(async () => {
    try {
      const data = await API.graphql({ query: listNodes, variables: { filter } });
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //  @ts-ignore
      const { items } = data.data.listNodes;
      const undeletedItems = items.filter(
        // eslint-disable-next-line no-underscore-dangle
        (collabarator: CartProps) => collabarator._deleted === null,
      );

      const collabaratorItems = undeletedItems.map(
        (collabarator: CartProps) => collabarator.collabarators,
      );
      const flatenItems = collabaratorItems.flat();
      const removeOwner = flatenItems.filter((collabarator: string) => collabarator !== userEmail);
      const simple = removeOwner.map((collabarator: string) =>
        collabarator.replace('@gmail.com', ''),
      );

      const emptyArray = new Set();
      const restricted = simple.filter((collabarator: string) => {
        const duplicate = emptyArray.has(collabarator);
        emptyArray.add(collabarator);
        return !duplicate;
      });

      return restricted;
    } catch (err) {
      throw new Error('Error filter by Letter');
    }
  }, [filter, userEmail]);

  const onFilterByTitle = useCallback(
    async (word) => {
      try {
        setValue(word);
        const data = await getAllNodes();
        const newNodes = data.filter((collabarator) =>
          collabarator.toLowerCase().includes(word.toLowerCase()),
        );

        setSuggestions(newNodes);
      } catch (err) {
        throw new Error('Error filter by Letter');
      }
    },
    [getAllNodes],
  );

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

  const onConfirmKeyup = (key: string) => {
    if (key === 'Enter') onConfirm();
  };

  const onRemove = (user: string) => {
    setUsers(users.filter((collabarator) => collabarator !== user));
  };

  return (
    <div className={styles.collabarator} style={{ display: isOpen && 'none' }}>
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
            className="color-input"
            value={value}
            onChange={(e) => onFilterByTitle(e.target.value)}
            onKeyUp={(e) => onConfirmKeyup(e.key)}
            type="text"
            placeholder="Person or Email to share with"
          />
        </div>
        {value && <Icon onClick={onConfirm} className={styles.user_confirm} name="done" />}
      </div>
      {value && (
        <>
          {suggestions.length !== 0 && (
            <div className={styles.suggestions}>
              {suggestions.map((suggestion) => (
                <div
                  className={styles.suggest_item}
                  onClick={() => {
                    setValue(`${suggestion}@gmail.com`);
                    setSuggestions([]);
                  }}
                >
                  {suggestion}@gmail.com
                </div>
              ))}
            </div>
          )}
        </>
      )}
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
