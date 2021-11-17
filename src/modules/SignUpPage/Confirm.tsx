import { FC, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import styles from '../SignInPage/SignInPage.module.scss';

const ConfirmPage: FC = () => {
  const history = useHistory();
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmCode, setConfirmCode] = useState('');

  const confirmSignUp = async (e) => {
    const userEmail = localStorage.getItem('userEmail');
    e.preventDefault();

    if (confirmCode.length > 1) {
      try {
        const data = await Auth.confirmSignUp(userEmail, confirmCode);
        
        localStorage.setItem("assessToken", data.signInUserSession.accessToken.jwtToken)
        history.push("/");
      } catch (error) {
        console.log('error sign Up:', error);
      }
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    setConfirmCode(e.target.value);
  };

  return (
    <div className={styles.sign}>
        <form className={styles.sign__form} onSubmit={(e) => confirmSignUp(e)}>
          <h1 className={styles.sign__title}> Confirm code </h1>
          <div className={styles.sign__inputDiv}>
            <input type="text" placeholder="Code" name="code" onChange={(e) => handleChange(e)} />
          </div>
          <div className={styles.sign__buttonDiv}>
            <Link to="/signin">Sign in instead</Link>
            <button type="submit"> Confirm </button>
          </div>
        </form>
    </div>
  );
};

export default ConfirmPage;
