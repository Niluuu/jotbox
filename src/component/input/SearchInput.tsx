import { FC, useCallback, useState } from 'react';
import styles from './SearchInput.module.scss';
import { Icon } from '../Icon/Icon';

/**
 * Main Logo component for user interaction
 */

const SearchInput: FC = () => {
  const [filterLetter, setFilterLetter] = useState('');

  const handleChange = (e) => {console.log(e)};

  return (
    <div className={styles.search__row}>
      <div className={styles.search__input}>
        <input value={filterLetter} placeholder="Поиск" onChange={(e) => handleChange(e)} />
        <button type="button" className={styles.remove_btn}>
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
