import { FC, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import styles from './SignUpPage.module.scss';
import OnErrorMessage from '../../component/message/message';

const SignUpPage: FC = () => {
  const history = useHistory();
  const [typePassword, settypePassword] = useState(false);
  const [hasError, setHasError] = useState({
    active: false,
    success: false,
    message: 'You signed up successfully',
  });

  const [userState, setUserState] = useState({
    userName: '',
    password: '',
  });

  const signUp = async (e) => {
    e.preventDefault();

    if (userState.userName.length > 1 && userState.password.length > 1) {
      try {
        await Auth.signUp({
          username: userState.userName,
          password: userState.password,
        });
        localStorage.setItem('userEmail', userState.userName);

        setHasError({ active: true, success: true, message: 'You Signed Up Successfully' });

        setTimeout(() => {
          setHasError((prev) => ({ ...prev, active: false }));
          history.push('/confirmCode');
        }, 5000);
      } catch (err) {
        setHasError({ active: true, success: false, message: err.message });

        setTimeout(() => setHasError((prev) => ({ ...prev, active: false })), 5000);

        throw new Error(`Error sign up: ${err}`);
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
      <div className={styles.sign__wrapper}>
        <form className={styles.sign__form} onSubmit={(e) => signUp(e)}>
          <h1 className={styles.sign__title}> Create your Google account </h1>
          <div className={styles.sign__inputDiv}>
            <input
              type="text"
              placeholder="Name"
              name="userName"
              onChange={(e) => handleChange(e)}
            />
          </div>

          <div className={styles.sign__inputDiv}>
            <input
              type={typePassword ? 'text' : 'password'}
              placeholder="Password"
              name="password"
              onChange={(e) => handleChange(e)}
            />
          </div>
          <div className={styles.sign__link}>
            <p> Use 8 or more characters with a mix of letters, numbers & symbols. </p>
            <div>
              <input
                type="checkbox"
                id="showPassword"
                checked={typePassword}
                onClick={toggle}
                defaultChecked={false}
              />
              <label htmlFor="showPassword"> Show Password </label>
            </div>
          </div>
          <div className={styles.sign__buttonDiv}>
            <Link to="/signIn">Sign in instead</Link>
            <button type="submit" onClick={(e) => signUp(e)}>
              {' '}
              submit{' '}
            </button>
          </div>
        </form>
        <OnErrorMessage
          active={hasError.active}
          success={hasError.success}
          message={hasError.message}
        />
      </div>
    </div>
  );
};

export default SignUpPage;
