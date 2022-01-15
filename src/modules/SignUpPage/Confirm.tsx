import { FC, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import styles from '../SignInPage/SignInPage.module.scss';
import OnErrorMessage from '../../component/message/message';

const ConfirmPage: FC = () => {
  const history = useHistory();
  const [confirmCode, setConfirmCode] = useState('');
  const [hasError, setHasError] = useState({
    active: false,
    success: false,
    message: 'You signed up successfully',
  });

  const confirmSignUp = async (e) => {
    const userEmail = localStorage.getItem('userEmail');
    e.preventDefault();

    if (confirmCode.length > 1) {
      try {
        const data = await Auth.confirmSignUp(userEmail, confirmCode);

        localStorage.setItem('assessToken', data.signInUserSession.accessToken.jwtToken);

        setHasError({
          active: true,
          success: true,
          message: 'You sgin uped succsessfully. You can Sgin in know',
        });

        setTimeout(() => {
          setHasError((prev) => ({ ...prev, active: false }));
          history.push('/sginin');
        }, 3000);
      } catch (error) {
        setHasError({ active: true, success: false, message: 'Something went wrong' });
        setTimeout(() => setHasError((prev) => ({ ...prev, active: false })), 5000);
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
      <OnErrorMessage
        active={hasError.active}
        success={hasError.success}
        message={hasError.message}
      />
    </div>
  );
};

export default ConfirmPage;
