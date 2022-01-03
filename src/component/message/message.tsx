import { FC } from 'react';
import classNames from 'classnames';
import { Icon } from '../Icon/Icon';

interface ErrorMessageType {
  success: boolean;
  active: boolean;
  message: string;
}

const OnErrorMessage: FC<ErrorMessageType> = ({ success, active, message }) => {
  return (
    <div className={classNames('errorMessage', active && 'active')}>
      <div>
        <Icon name={success ? 'success' : 'error'} />
      </div>
      {message}
    </div>
  );
};

export default OnErrorMessage;
