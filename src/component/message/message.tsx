import { useState } from 'react';
import classNames from 'classnames';
import { Icon } from '../Icon/Icon';

const OnErrorMessage = (message: string, icon: 'success' | 'error') => {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState({
    message: 'You signed in succesfully',
    icon: 'success',
  });

  setError({ message, icon });
  setHasError(true);
  setTimeout(() => setHasError(false), 6000);

  return (
    <div className={classNames('errorMessage', hasError && 'active')}>
      <div>
        <Icon name={error.icon} />
      </div>
      {error.message}
    </div>
  );
};

export default OnErrorMessage;
