/* eslint-disable default-case */
import { useState, useEffect, useCallback } from 'react';
import { Auth, Hub } from 'aws-amplify';
import { useHistory } from 'react-router-dom';
import GoogleLogo from '../../assets/images/svg-icons/GoogleLogo';

const SigninWithGoogle = () => {
  const [user, setUser] = useState(null);
  const history = useHistory();

  const getUser = useCallback(async () => {
    try {
      const userData = await Auth.currentAuthenticatedUser();
      if (userData.attributes) {
        localStorage.setItem('assessToken', userData.signInUserSession.accessToken.jwtToken);
        localStorage.setItem('userEmail', userData.attributes.email);
        history.push('/');
      }
    } catch {
      // eslint-disable-next-line no-console
      return console.log('Not signed in');
    }
  }, [history]);

  useEffect(() => {
    Hub.listen('auth', ({ payload: { event, data } }) => {
      switch (event) {
        case 'signIn':
        case 'cognitoHostedUI':
          getUser().then((userData) => setUser(userData));
          break;
        case 'signOut':
          setUser(null);
          break;
        case 'signIn_failure':
        case 'cognitoHostedUI_failure':
          // eslint-disable-next-line no-console
          console.log('Sign in failure', data);
          break;
      }
    });

    getUser().then((userData) => setUser(userData));
  }, [getUser]);

  return (
    <>
      {user ? (
        <button type="button" onClick={() => Auth.signOut()}>
          Sign Out
        </button>
      ) : (
        <button type="button" onClick={() => Auth.federatedSignIn({ provider: 'Google' })}>
          <GoogleLogo />
          Sign in with google
        </button>
      )}
    </>
  );
};
export default SigninWithGoogle;
