import { FC, useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import styles from './SearchInput.module.scss';
import { Icon } from '../Icon/Icon';
import { setFilterByTitle } from '../../reducers/filterByTitle';

/**
 * Main Logo component for user interaction
 */

const SearchInput: FC = () => {
  const dispatch = useDispatch();
  const [value, setValue] = useState('');

  const handleChange = useCallback(
    (e) => {
      dispatch(setFilterByTitle(e.target.value));
      setValue(e.target.value);
    },
    [dispatch],
  );

  const clearValue = useCallback(() => {
    setValue('');
    dispatch(setFilterByTitle(''));
  }, [dispatch]);

  return (
    <div className={styles.search__row}>
      <div className={styles.search__input}>
        <input value={value} placeholder="Поиск" onChange={(e) => handleChange(e)} />
        <button type="button" className={styles.remove_btn} onClick={() => clearValue()}>
          <Icon name="remove" />
        </button>
        <button type="button" className={styles.search_btn}>
          <Icon name="search" />
        </button>
      </div>
    </div>
  );
};

export default SearchInput;
