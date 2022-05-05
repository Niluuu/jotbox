import { FC, useState } from 'react';
import classNames from 'classnames';
import styles from '../../modules/HomePage/HomePage.module.scss';
import Modal from '../../component/modal/Modal';
import { Icon } from '../../component/Icon/Icon';

const AddLebelModal: FC = () => {
  const [state, setstate] = useState(false);
  return (
    <Modal
      title="Add Label"
      toggleModal={() => {
        console.log('dsa');
      }}
      isOpen={state}
    >
      <div
        className={classNames(styles.navbar_popover, styles.labels, styles.navbar_popover_settings)}
      >
        dadsa
      </div>
    </Modal>
  );
};

export default AddLebelModal;
