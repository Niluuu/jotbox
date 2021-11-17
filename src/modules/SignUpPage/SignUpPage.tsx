import { FC, useState } from 'react';
import { Link , useHistory} from 'react-router-dom';
import { Auth } from 'aws-amplify';
import styles from './SignUpPage.module.scss';

const SignUpPage: FC = () => {
  const history = useHistory();
  const [typePassword, settypePassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("")
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
        history.push("/confirmCode");
        localStorage.setItem("userEmail", userState.userName)

      } catch (error) {
        console.log('error sign Up:', error);
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
            <button type="submit"  onClick={(e) => signUp(e)}> submit </button>
          </div>
        </form>
        <div className={styles.sign__image}>
          One account. All of Google <br /> Working for you.
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
