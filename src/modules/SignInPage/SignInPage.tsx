import { FC, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import classNames from 'classnames';
import styles from './SignInPage.module.scss';
import onErrorMessage from '../../component/message/message';

const SignInPage: FC = () => {
  const history = useHistory();
  const [userState, setUserState] = useState({
    userName: '',
    password: '',
  });
  const [typePassword, settypePassword] = useState(false);

  const signIn = async (e) => {
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

        // onErrorMessage('You signed in succesfully', 'success');
      } catch (err) {
        // onErrorMessage(err.message, 'error');
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
        <h1 className={styles.sign__title}> Sign In </h1>
        {/* <h1 className={styles.sign__subTitle}> Use your Google Account </h1> */}
        <input
          type="text"
          name="userName"
          placeholder="User name"
          value={userState.userName}
          onChange={handleChange}
        />
        <input
          type={typePassword ? 'text' : 'password'}
          name="password"
          placeholder="Password"
          value={userState.password}
          onChange={handleChange}
        />
        <div className={classNames(styles.sign__link, styles.password_input)}>
          <input type="checkbox" id="showPassword" checked={typePassword} onChange={toggle} />
          <p>Show password</p>
        </div>

        <div className={styles.sign__buttonDiv}>
          <Link to="/signUp">Create account</Link>
          <button type="submit" onClick={signIn}>Next</button>
        </div>
      </form>
    </div>
  );
};

export default SignInPage;
