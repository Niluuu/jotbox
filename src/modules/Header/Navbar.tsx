import { FC, useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import classNames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../app/store';
import styles from './Navbar.module.scss';
import Popover from '../../component/popover/Popover';
import { Icon } from '../../component/Icon/Icon';
import { Avatar } from '../../component/avatar/Avatar';
import { toggleGrid } from '../../reducers/layout';

/**
 * Main Header component for user interaction
 */

export const Navbar: FC = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [updated, setUpdated] = useState(false);
  const dispatch = useDispatch();

  async function signOut() {
    try {
      await Auth.signOut();

      localStorage.removeItem('assessToken');
      localStorage.removeItem('userEmail');
      history.push('/sginin');
      // onErrorMessage('You sgin out succesfully', 'success');
    } catch (error) {
      // onErrorMessage('Error sgin out', 'error');
    }
  }

  const loadChanges = useCallback(() => {
    const completeUpdate = (val) =>
      setTimeout(() => {
        setUpdated(val);
      }, 2000);

    new Promise((resolve) => {
      resolve(true);
      setLoading(true);
      completeUpdate(true);
    }).then((resolve) => {
      if (resolve) {
        setTimeout(() => {
          setLoading(false);
          completeUpdate(false);
        }, 4000);
      }
    });
  }, [loading]);

  const mapStateToProps = useSelector((state: RootState) => {
    return {
      layoutReducer: state.layoutGrid,
      text: state.editorReducer.text,
    };
  });

  const { grid } = mapStateToProps.layoutReducer;
  return (
    <nav className={styles.navbar}>
      <button type="button" onClick={loadChanges}>
        <Icon
          name={updated ? 'cloud' : 'loading'}
          className={loading && !updated ? styles.loading : undefined}
        />
      </button>
      <button type="button" onClick={() => dispatch(toggleGrid())}>
        <Icon name={grid ? 'grid' : 'grid4'} />
      </button>

      <Popover
        content={
          <div className={classNames(styles.navbar_popover, styles.navbar_popover_settings)}>
            <ul>
              <li key="1">
                <a href="#">Настройки</a>
              </li>
              <li key="2">
                <a href="#">Использовать тёмную тему</a>
              </li>
              <li key="3">
                <a href="#">Отключить тёмную тему</a>
              </li>
              <li key="4">
                <a href="#">Отправить отзыв</a>
              </li>
              <li key="5">
                <a href="#">Справка</a>
              </li>
            </ul>
          </div>
        }
        placement="bottom-start"
      >
        <button type="button" className={styles.settings_btn}>
          <Icon name="setting" />
        </button>
      </Popover>

      <Popover
        content={
          <div className={classNames(styles.navbar_popover__profile, 'scroll-bar')}>
            <div className={styles.profile__info}>
              <div className={styles.profile__info_pictures}>
                <Avatar />
                <span>
                  <Icon name="picture" />
                </span>
              </div>
              <h1>{localStorage.getItem('userEmail')}</h1>
              <p>{localStorage.getItem('userEmail')}</p>
              <a href="https://myaccount.google.com/?utm_source=OGB&utm_medium=act">
                Управление аккаунтом Google
              </a>
            </div>
            <div className={styles.navbar_popover__profile_row}>
              <a href="#">
                <Icon name="add-accaunt" />
                <span>Добавить аккаунт</span>
              </a>
            </div>
            <div className={classNames(styles.navbar_popover__profile_row, styles.signOut)}>
              <a onClick={signOut} href="#">
                Sign out
              </a>
            </div>
            <div className={classNames(styles.navbar_popover__profile_row, styles.privacy)}>
              <a href="#">
                <span>Privacy Policy • Term of Service</span>
              </a>
            </div>
          </div>
        }
        placement="bottom-start"
      >
        <Avatar hover />
      </Popover>
    </nav>
  );
};
