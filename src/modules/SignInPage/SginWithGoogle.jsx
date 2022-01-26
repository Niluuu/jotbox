/* eslint-disable default-case */
import { useState, useEffect } from 'react';
import { Auth, Hub } from 'aws-amplify';
import { useHistory } from 'react-router-dom';
import GoogleLogo from '../../assets/images/svg-icons/GoogleLogo';

function SigninWithGoogle() {
  const [user, setUser] = useState(null);
  const history = useHistory();

  function getUser() {
    return Auth.currentAuthenticatedUser()
      .then((userData) => userData)
      .then((userData) => {
        if (userData.attributes) {
          localStorage.setItem('assessToken', userData.signInUserSession.accessToken.jwtToken);
          localStorage.setItem('userEmail', userData.attributes.email);
          history.push('/');
        }
      })
      .catch(() => console.log('Not signed in'));
  }

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
          console.log('Sign in failure', data);
          break;
      }
    });

    getUser().then((userData) => setUser(userData));
  }, []);

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
}
export default SigninWithGoogle;
