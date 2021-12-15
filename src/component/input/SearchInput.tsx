import { FC, useCallback, useState } from 'react';
import styles from './SearchInput.module.scss';
import { Icon } from '../Icon/Icon';

/**
 * Main Logo component for user interaction
 */

const SearchInput: FC = () => {
  const [value, setValue] = useState('');

  const handleChange = useCallback((e) => {
    setValue(e.target.value);
  }, []);

  const clearValue = useCallback(() => {
    setValue('');
  }, []);

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
