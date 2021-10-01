import { FC, ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import styles from './Navbar.module.scss';
import Popover from '../../component/popover/Popover';
import { Icon } from '../../component/Icon/Icon';
import { Avatar } from '../../component/avatar/Avatar';
import { googleLinks1, googleLinks2 } from '../../utils/google-links';

export interface NavbarProps {
  isLoggedIn: boolean;
}

/**
 * Main Header component for user interaction
 */

export const Navbar: FC<NavbarProps> = ({ isLoggedIn }) => {
  const [gridType, setGridType] = useState(false);
  const [loading, setLoading] = useState(false);
  const [updated, setUpdated] = useState(false);

  const changeGrid = useCallback(() => setGridType(!gridType), [gridType]);
  const loadChanges = useCallback(() => {
    const completeUpdate = (val) =>
      setTimeout(() => {
        setUpdated(val);
      }, 2000);

    new Promise((resolve, reject) => {
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

  return (
    <nav className={styles.navbar}>
      <button type="button" onClick={loadChanges}>
        <Icon
          name={updated ? 'cloud' : 'loading'}
          className={loading && !updated ? styles.loading : undefined}
        />
      </button>
      <button type="button" onClick={changeGrid}>
        <Icon name={gridType ? 'grid' : 'grid4'} />
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
          <div className={classNames(styles.navbar_popover, 'scroll-bar')}>
            <ul className={styles.navbar_popover_ul}>
              {googleLinks1.map(({ name, position, url }, i) => {
                return (
                  <li className={styles.navbar_popover_link}>
                    {i === 0 ? (
                      <a href={url} className={styles.link_avatar}>
                        <Avatar hover />
                        <p>{name}</p>
                      </a>
                    ) : (
                      <a href={url}>
                        <div
                          style={{
                            backgroundImage:
                              'url(https://ssl.gstatic.com/gb/images/p1_c9bc74a1.png)',
                            backgroundPosition: position,
                          }}
                        >
                          <p>{name}</p>
                        </div>
                      </a>
                    )}
                  </li>
                );
              })}
            </ul>
            <ul
              className={styles.navbar_popover_ul}
              style={{ borderTop: '1px solid #f1f3f4', paddingTop: '40px' }}
            >
              {googleLinks2.map(({ name, position, url }, i) => {
                return (
                  <li className={styles.navbar_popover_link}>
                    <a href={url}>
                      <div
                        style={{
                          backgroundImage: 'url(https://ssl.gstatic.com/gb/images/p1_c9bc74a1.png)',
                          backgroundPosition: position,
                        }}
                      >
                        <p>{name}</p>
                      </div>
                    </a>
                  </li>
                );
              })}
            </ul>
            <div className={styles.navbar_popover__more_link}>
              <a href="https://www.google.co.uz/intl/ru/about/products">
                Другие приложения и продукты от Google
              </a>
            </div>
          </div>
        }
        placement="bottom-start"
      >
        <button type="button" className={styles.options}>
          <Icon name="grid3" />
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
              <h1>Saidumarova Nilufar</h1>
              <p>saidumarovanilufar@gamil.com</p>
              <a href="https://myaccount.google.com/?utm_source=OGB&utm_medium=act">
                Управление аккаунтом Google
              </a>
            </div>

            <div className={styles.navbar_popover__profile_row}>
              <a href="asdas">
                <Icon name="add-accaunt" />
                <span>Добавить аккаунт</span>
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
