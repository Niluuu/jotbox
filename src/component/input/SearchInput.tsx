import { FC, useCallback, useState } from 'react';
import classNames from 'classnames';
import styles from './SearchInput.module.scss';
import { Icon } from '../Icon/Icon';
import { filterByLetter } from '../../utils/hooks/filterByLetter';

/**
 * Main Logo component for user interaction
 */

const SearchInput: FC = () => {
  const [filterLetter, setFilterLetter] = useState('');

  // TODO: add context hook for leatter use it
  const handleChange = (e) => {
    const filteredNodes = filterByLetter(e.target.value, setFilterLetter)
  }

  return (
    <div className={styles.search__row}>
      <div className={styles.search__input}>
        <input value={filterLetter} placeholder="Поиск" 
          onChange={(e) => handleChange(e)} />
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
