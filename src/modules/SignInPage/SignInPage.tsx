import { FC } from 'react';
import { Link } from 'react-router-dom';
import GoogleLogo from '../../assets/images/svg-icons/GoogleLogo';
import styles from './SignInPage.module.scss';

const SignInPage: FC = () => {
  return (
    <div className={styles.sign}>
      <form className={styles.sign__form}>
        <GoogleLogo />
        <h1 className={styles.sign__title}> Sign in </h1>
        <h1 className={styles.sign__subTitle}> Use your Google Account </h1>
        <input type="email" placeholder="Email or Phone" />
        <div className={styles.sign__link}>
          <a href="#"> Forgot email? </a>
        </div>
        <div className={styles.sign__link}>
          <span> Not your computer? Use Guest mode to sign in privately. </span> <br />
          <a href="#">Learn More </a>
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
