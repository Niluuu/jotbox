/* eslint-disable max-lines */
/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/require-default-props */
import { FC, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import uniqid from 'uniqid';
import styles from './Checkouts.module.scss';
import { Icon } from '../Icon/Icon';
import { RootState } from '../../app/store';
import { setMainCheckouts, setModalCheckouts } from '../../reducers/checkouts';

interface CheckoutsProps {
  isModal?: boolean;
}

const Checkouts: FC<CheckoutsProps> = ({ isModal }) => {
  const mapStateToProps = useSelector((state: RootState) => {
    return {
      mainCheckouts: state.checkoutsReducer.mainCheckouts,
      modalCheckouts: state.checkoutsReducer.modalCheckouts,
    };
  });

  const { mainCheckouts, modalCheckouts } = mapStateToProps;

  const defaultCheckouts = isModal ? modalCheckouts : mainCheckouts;

  const dispatch = useDispatch();

  const mainCheckoutRef = useRef<HTMLInputElement>(null);

  const onChangeMainCheckout = (title: string) => {
    mainCheckoutRef.current.blur();
    mainCheckoutRef.current.value = '';

    const newCheckout = { title, focused: true, id: uniqid(), checked: false };

    if (isModal) {
      dispatch(setModalCheckouts([...modalCheckouts, newCheckout]));
    } else {
      dispatch(setMainCheckouts([...mainCheckouts, newCheckout]));
    }
  };

  const onChangeCheckouts = (id: number, title: string) => {
    if (isModal) {
      dispatch(
        setModalCheckouts(
          modalCheckouts.map((checkout) =>
            checkout.id === id ? { ...checkout, title } : checkout,
          ),
        ),
      );
    } else {
      dispatch(
        setMainCheckouts(
          mainCheckouts.map((checkout) => (checkout.id === id ? { ...checkout, title } : checkout)),
        ),
      );
    }
  };

  const onFocusCheckouts = (id: number) => {
    if (isModal) {
      dispatch(
        setModalCheckouts(
          modalCheckouts.map((checkout) =>
            checkout.id === id ? { ...checkout, focused: true } : checkout,
          ),
        ),
      );
    } else {
      dispatch(
        setMainCheckouts(
          mainCheckouts.map((checkout) =>
            checkout.id === id ? { ...checkout, focused: true } : checkout,
          ),
        ),
      );
    }
  };

  const onBlurCheckouts = (id: number) => {
    if (isModal) {
      dispatch(
        setModalCheckouts(
          modalCheckouts.map((checkout) =>
            checkout.id === id ? { ...checkout, focused: false } : checkout,
          ),
        ),
      );
    } else {
      dispatch(
        setMainCheckouts(
          mainCheckouts.map((checkout) =>
            checkout.id === id ? { ...checkout, focused: false } : checkout,
          ),
        ),
      );
    }
  };

  const onCheckoutChecked = (id: number) => {
    if (isModal) {
      dispatch(
        setModalCheckouts(
          modalCheckouts.map((checkout) =>
            checkout.id === id ? { ...checkout, checked: !checkout.checked } : checkout,
          ),
        ),
      );
    } else {
      dispatch(
        setMainCheckouts(
          mainCheckouts.map((checkout) =>
            checkout.id === id ? { ...checkout, checked: !checkout.checked } : checkout,
          ),
        ),
      );
    }
  };

  const onRemoveCheckout = (id: number) => {
    if (isModal) {
      dispatch(setModalCheckouts(modalCheckouts.filter((checkout) => checkout.id !== id)));
    } else {
      dispatch(setMainCheckouts(mainCheckouts.filter((checkout) => checkout.id !== id)));
    }
  };

  const checkoutContent = (checkout) => (
    <div className={classNames(styles.checkout_item, checkout.focused ? styles.focused : null)}>
      <Icon
        color="premium"
        size="xs"
        onClick={() => onCheckoutChecked(checkout.id)}
        name={checkout.checked ? 'edit-bordered' : 'box'}
      />
      <input
        className={classNames('color-input', checkout.checked ? styles.checked : null)}
        autoFocus={checkout.focused}
        onFocus={() => onFocusCheckouts(checkout.id)}
        onBlur={() => onBlurCheckouts(checkout.id)}
        onChange={(e) => onChangeCheckouts(checkout.id, e.target.value)}
        value={checkout.title}
        type="text"
      />
      <Icon color="premium" size="xs" name="exit" onClick={() => onRemoveCheckout(checkout.id)} />
    </div>
  );

  const selectedCheckouts = defaultCheckouts.filter((checkout) => checkout.checked);
  const unSelectedCheckouts = defaultCheckouts.filter((checkout) => !checkout.checked);

  return (
    <div className={classNames(styles.checkout, isModal ? styles.modal : null)}>
      {unSelectedCheckouts.map((checkout) => checkoutContent(checkout))}
      <div className={styles.checkout_main}>
        <input
          className="color-input"
          autoFocus
          ref={mainCheckoutRef}
          placeholder="Add your List"
          onChange={(e) => onChangeMainCheckout(e.target.value)}
          type="text"
        />
      </div>
      {selectedCheckouts.length > 0 && (
        <>
          {' '}
          <br />
          {selectedCheckouts.length} Completed Items <br />
          {selectedCheckouts.map((checkout) => checkoutContent(checkout))}
        </>
      )}
    </div>
  );
};

export default Checkouts;
