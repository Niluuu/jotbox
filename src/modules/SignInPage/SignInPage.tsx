import { FC, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import classNames from 'classnames';
import styles from './SignInPage.module.scss';

const SignInPage: FC = () => {
  const history = useHistory();
  const [userState, setUserState] = useState({
    userName: '',
    password: '',
  });
  const [typePassword, settypePassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const sginIn = async (e) => {
    e.preventDefault();
    if (userState.userName.length > 1 && userState.password.length > 1) {
      try {
        const data = await Auth.signIn({
          username: userState.userName,
          password: userState.password,
        });

        localStorage.setItem("assessToken", data.signInUserSession.accessToken.jwtToken)
        localStorage.setItem("userEmail",data.attributes.email)
        history.push("/")
        console.log("data", data)
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
      <form className={styles.sign__form} onSubmit={sginIn}>
        <h1 className={styles.sign__title}> Sign in </h1>
        <h1 className={styles.sign__subTitle}> Use your Google Account </h1>
        <input
          type="text"
          name="userName"
          placeholder="User name"
          value={userState.userName}
          onChange={handleChange}
        />
        <a href="#"> Forgot user name? </a>
        <input
          type={typePassword ? 'password' : 'text'}
          name="password"
          placeholder="Password"
          value={userState.password}
          onChange={handleChange}
        />
        <div className={classNames(styles.sign__link, styles.password_input)}>
          <input
            type="checkbox"
            id="showPassword"
            checked={typePassword}
            onClick={toggle}
            defaultChecked={false}
          />
          <label htmlFor="showPassword"> Show Password </label>
        </div>

        <div className={styles.sign__buttonDiv}>
          <Link to="/signUp">Create account</Link>
          <a href="#"> </a>
          <button type="submit" onClick={sginIn}> Next </button>
        </div>
      </form>
    </div>
  );
};

export default SignInPage;
