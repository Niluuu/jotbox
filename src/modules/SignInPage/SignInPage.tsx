import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useHistory } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import classNames from 'classnames';
import styles from './SignInPage.module.scss';

import OnErrorMessage from '../../component/message/message';
import SigninWithGoogle from './SginWithGoogle';

const SignInPage: FC = () => {
  const history = useHistory();
  const { t } = useTranslation();

  const [userState, setUserState] = useState({
    userName: '',
    password: '',
  });
  const [typePassword, settypePassword] = useState(false);
  const [hasError, setHasError] = useState({
    active: false,
    success: false,
    message: t('you-signed-in-succesfully'),
  });

  const signIn = async (e) => {
    e.preventDefault();
    if (userState.userName.length > 1 && userState.password.length > 1) {
      try {
        const data = await Auth.signIn({
          username: userState.userName,
          password: userState.password,
        });

        localStorage.setItem('assessToken', data.signInUserSession.accessToken.jwtToken);
        localStorage.setItem('userEmail', data.attributes.email);

        setHasError({ active: true, success: true, message: t('you-signed-in-succesfully') });

        setTimeout(() => {
          setHasError((prev) => ({ ...prev, active: false }));
          history.push('/');
        }, 5000);
      } catch (err) {
        setHasError({ active: true, success: false, message: err.message });

        setTimeout(() => setHasError((prev) => ({ ...prev, active: false })), 5000);
      }
    }
  };

  const handleChange = (e) => {
    e.preventDefault();

    const { value, name } = e.target;
    setUserState({
      ...userState,
      [name]: value,
    });
  };

  const toggle = () => {
    settypePassword(!typePassword);
  };

  return (
    <div className={styles.sign}>
      <form className={styles.sign__form} onSubmit={signIn}>
        <h1 className={styles.sign__title}> {t('sign-in')} </h1>
        <h1 className={styles.sign__subTitle}> {t('use-your-google-account')} </h1>
        <div className={styles.google_page}>
          <SigninWithGoogle />
        </div>
        <input
          type="text"
          name="userName"
          placeholder={t('user-name')}
          value={userState.userName}
          onChange={handleChange}
        />
        <input
          type={typePassword ? 'text' : 'password'}
          name="password"
          placeholder={t('password')}
          value={userState.password}
          onChange={handleChange}
        />
        <div className={classNames(styles.sign__link, styles.password_input)}>
          <input
            className={styles.checkbox}
            type="checkbox"
            id="showPassword"
            checked={typePassword}
            onChange={toggle}
          />
          <p>{t('show-password')}</p>
        </div>

        <div className={styles.sign__buttonDiv}>
          <Link to="/signUp">{t('create-account')}</Link>
          <button type="submit" onClick={signIn}>
            {t('next')}
          </button>
        </div>
      </form>

      <OnErrorMessage
        active={hasError.active}
        success={hasError.success}
        message={hasError.message}
      />
    </div>
  );
};

export default SignInPage;
