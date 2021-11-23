import { FC, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import styles from './SignInPage.module.scss';

type signInProps = {
  onErrorMessage: (message: string, icon: 'success' | 'error') => void;
}

const SignInPage: FC<signInProps> = ({onErrorMessage}) => {
  const history = useHistory();
  const [userState, setUserState] = useState({
    userName: '', password: '',
  });
  const [typePassword, settypePassword] = useState(false);

  const signIn = async (e) => {
    e.preventDefault();
    if (userState.userName.length > 1 && userState.password.length > 1) {
      try {
        const { user } = await Auth.signIn({
          username: userState.userName,
          password: userState.password,
        });
        onErrorMessage('You signed in succesfully', 'success')
      } catch (err) {
        onErrorMessage(err.message, 'error')
      }
    }
    
    localStorage.setItem("isAuthenticated", "true")
    history.push("/")
  };

  const handleChange = (e) => {
    e.preventDefault();

    const { value, name } = e.target;
    setUserState({
      ...userState, [name]: value,
    });
  };

  const toggle = () => {
    settypePassword(!typePassword);
  };
  
  return (
    <div className={styles.sign}>
      <form className={styles.sign__form} onSubmit={signIn}>
        <h1 className={styles.sign__title}> Sign In </h1>
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
          type={typePassword ? 'text' : 'password'}
          name="password"
          placeholder="Password"
          value={userState.password}
          onChange={handleChange}
        />
        <div className={styles.sign__link}>
          <label htmlFor="showPassword"> Show Password </label>
          <input
            type="checkbox"
            id="showPassword"
            checked={typePassword}
            onChange={toggle}
          />
        </div>

        <div className={styles.sign__buttonDiv}>
          <Link to="/signUp">Create account</Link>
          <a href="#"> </a>
          <button type="submit"> Next </button>
        </div>
      </form>
    </div>
  );
};

export default SignInPage;
