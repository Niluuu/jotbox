import { FC, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Auth } from 'aws-amplify';
import classNames from 'classnames';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../app/store';
import styles from './Navbar.module.scss';
import Popover from '../../component/popover/Popover';
import { Icon } from '../../component/Icon/Icon';
import { Avatar } from '../../component/avatar/Avatar';
import { toggleGrid } from '../../reducers/layout';
import { setRefreshPage } from '../../reducers/refreshPage';

/**
 * Main Header component for user interaction
 */

export const Navbar: FC = () => {
  const [loading, setLoading] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [updated, setUpdated] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  const { t } = useTranslation();

  async function signOut() {
    setRedirect(true);
    try {
      await Auth.signOut();

      localStorage.removeItem('assessToken');
      localStorage.removeItem('userEmail');
      history.push('/signIn');
    } catch (error) {
      throw new Error('sign out error');
    }
  }

  const loadChanges = useCallback(() => {
    const completeUpdate = (val: boolean) =>
      setTimeout(() => {
        setUpdated(val);
        dispatch(setRefreshPage());
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
          // eslint-disable-next-line no-console
          console.log(loading);
        }, 4000);
      }
    });
  }, [loading, dispatch]);

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
      <button className={styles.gridButton} type="button" onClick={() => dispatch(toggleGrid())}>
        <Icon name={grid ? 'grid' : 'grid4'} />
      </button>

      <Popover
        content={
          <div className={classNames(styles.navbar_popover, styles.navbar_popover_settings)}>
            <ul>
              <li key="2">
                <a href="#">{t('use dark theme')}</a>
              </li>
              <li key="3">
                <a href="#">{t('turn off dark theme')}</a>
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
              </div>
              <p>{localStorage.getItem('userEmail')}</p>
            </div>
            <div className={classNames(styles.navbar_popover__profile_row, styles.signOut)}>
              <a className={redirect && styles.disable} onClick={signOut}>
                {redirect ? t('loading') : t('sign out')}
                {redirect && <Icon name="loading" />}
              </a>
            </div>
            <div className={classNames(styles.navbar_popover__profile_row, styles.privacy)}>
              <a href="#">
                <span>
                  {t('privacy policy')} • {t('term of services')}
                </span>
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
