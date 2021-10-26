import { FC } from 'react';
import GoogleLogo from '../../assets/images/svg-icons/GoogleLogo';
import GoogleSuperLogo from '../../assets/images/svg-icons/GoogleSuperLogo';
import { Icon } from '../../component/Icon/Icon';
import styles from './SignUpPage.module.scss';

const SignUpPage: FC = () => {
  return (
    <div className={styles.sign}>
      <div className={styles.sign__wrapper}>
        <form className={styles.sign__form}>
          <GoogleLogo />
          <h1 className={styles.sign__title}> Create your Google account </h1>
          <div className={styles.sign__inputDiv}>
            <input type="text" placeholder="First Name" />
            <input type="text" placeholder="Last Name" />
          </div>
          <div className={styles.sign__inputDiv}>
            <input type="email" placeholder="User Name" />
          </div>
          <div className={styles.sign__link}>
            <p> You can use letters, numbers & periods. </p> <br />
            <a href="#"> Use my current email address instead </a>
          </div>
          <div className={styles.sign__inputDiv}>
            <input type="password" placeholder="Password" />
            <input type="password" placeholder="Confirm" />
          </div>
          <div className={styles.sign__link}>
            <p> Use 8 or more characters with a mix of letters, numbers & symbols. </p> 
            <div>
              <input type="checkbox" id="showPassword" />
              <label htmlFor="showPassword"> Show Password </label>
            </div>
          </div>
          <div className={styles.sign__buttonDiv}>
            <a href="#"> Sign in instead </a>
            <button type="submit"> Next </button>
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
