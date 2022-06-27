/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/require-default-props */
import { FC, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
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
import { updateNode } from '../../graphql/mutations';
import { setNodesToProps } from '../../reducers/nodes';
import { getModalNode } from '../../reducers/getNodeId';

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
  img: string[];
}

interface CollabaratorProps {
  owner?: string;
  isMainInput?: boolean;
  isOpen?: boolean;
  cartCollabarators?: string[];
  /**
   * Node Id
   */
  id?: string;
  /**
   * Node version of node
   */
  _version?: number;
}
/**
 * Main Collabarator component for user interaction
 */
const Collabarator: FC<CollabaratorProps> = ({
  isMainInput,
  cartCollabarators,
  isOpen,
  owner,
  id,
  _version,
}) => {
  const mapStateToProps = useSelector((state: RootState) => {
    return {
      inputCollabaratorUsers: state.collabaratorReducer.inputCollabaratorUsers,
      nodes: state.nodesReducer.nodes,
    };
  });

  const { inputCollabaratorUsers, nodes } = mapStateToProps;

  const userEmail = localStorage.getItem('userEmail');
  const collabarators = { contains: userEmail };
  const [filter] = useState({ collabarators });

  const [users, setUsers] = useState(isMainInput ? inputCollabaratorUsers : cartCollabarators);
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);
  const dispatch = useDispatch();

  const { t } = useTranslation();

  const [suggestions, setSuggestions] = useState([]);

  const onChangeCollabarators = useCallback(
    async (
      nodeId: string,
      nodeVersion: number,
      nodeCollabarators: string[],
    ): Promise<CartProps> => {
      try {
        const updatedNode = {
          id: nodeId,
          _version: nodeVersion,
          collabarators: nodeCollabarators,
        };

        const data = await API.graphql({
          query: updateNode,
          variables: { input: updatedNode },
        });
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //  @ts-ignore
        const item = data.data.updateNode;

        dispatch(setNodesToProps(nodes.map((newCart) => (newCart.id === nodeId ? item : newCart))));
        dispatch(getModalNode(item));

        return item;
      } catch (err) {
        throw new Error('Update node error');
      }
    },
    [dispatch, nodes],
  );

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

      const emptyArray = new Set();
      const restricted = removeOwner.filter((collabarator: string) => {
        const duplicate = emptyArray.has(collabarator);
        emptyArray.add(collabarator);
        return !duplicate;
      });

      const simple = restricted.map((collabarator: string) => ({
        userName: collabarator.split('@')[0],
        type: collabarator.substring(collabarator.indexOf('@')),
      }));
      return simple;
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
          collabarator.userName.toLowerCase().includes(word.toLowerCase()),
        );

        setSuggestions(
          newNodes.map((collabarator) => `${collabarator.userName}${collabarator.type}`),
        );
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
      onChangeCollabarators(id, _version, users);
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

  const nodeOwner = isMainInput ? userEmail : owner;

  return (
    <div className={styles.collabarator} style={{ display: isOpen && 'none' }}>
      <div className={styles.collabarator_header}>{t('collabarators')}</div>
      <div className={styles.user}>
        <img className={styles.user_img} src={avatar} />
        <div className={styles.user_text}>
          <span className={styles.user_title}>
            {' '}
            {isMainInput ? userEmail : owner} ({t('owner')}){' '}
          </span>
        </div>
      </div>
      {users.map(
        (user) =>
          nodeOwner !== user && (
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
            placeholder={t('person-or-email')}
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
                  className={styles.suggestions_item}
                  onClick={() => {
                    setValue(suggestion);
                    setSuggestions([]);
                  }}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </>
      )}
      {error && <div className={styles.message}>{t('please-enter-valid-email-adress')}</div>}
      <div className={styles.collabarator_footer}>
        <div>
          <button type="button" onClick={cancel}>
            {t('cancel')}
          </button>
          <button type="button" onClick={save}>
            {t('save')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Collabarator;
