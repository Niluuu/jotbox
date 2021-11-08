import { FC, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import GoogleLogo from '../../assets/images/svg-icons/GoogleLogo';
import GoogleSuperLogo from '../../assets/images/svg-icons/GoogleSuperLogo';
import styles from './SignUpPage.module.scss';

const SignUpPage: FC = () => {
  const [userState, setUserState] = useState({
    userName: '',
    password: '',
  });
  const [typePassword, settypePassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("")

  const signUp = async (e) => {
    e.preventDefault();

    console.log('user', userState);
    if (userState.userName.length > 1 && userState.password.length > 1) {
      try {
        const { user } = await Auth.signUp({
          username: userState.userName,
          password: userState.password,
        });
        console.log(user);
      } catch (error) {
        console.log('error signing up:', error);
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
          <GoogleLogo />
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
              type={typePassword ? 'password' : 'text'}
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
            <button type="submit"> submit </button>
          </div>
        </form>
        <div className={styles.sign__image}>
          <GoogleSuperLogo />
          One account. All of Google <br /> Working for you.
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
