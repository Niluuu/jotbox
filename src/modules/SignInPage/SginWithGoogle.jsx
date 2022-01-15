/* eslint-disable default-case */
import { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { Auth, Hub } from 'aws-amplify';
import OnErrorMessage from '../../component/message/message';

function SgininWithGooole() {
  const [user, setUser] = useState(null);

  function getUser() {
    return Auth.currentAuthenticatedUser()
      .then(userData => userData)
      .catch(() => console.log('Not signed in'));
  }

  useEffect(() => {
    Hub.listen('auth', ({ payload: { event, data } }) => {
      switch (event) {
        case 'signIn':
        case 'cognitoHostedUI':
          getUser().then(userData => setUser(userData))
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

    getUser().then(userData => setUser(userData));
  }, []);

  

  return (
    <div>
      <p>User: {user ? JSON.stringify(user.attributes) : 'None'}</p>
      {user ? (
        <button type="button" onClick={() => Auth.signOut()}>Sign Out</button>
      ) : (
        <button type="button" onClick={() => Auth.federatedSignIn({provider: 'Google'})}>Open Google</button>
      )}
    </div>
  );
}
export default SgininWithGooole;
