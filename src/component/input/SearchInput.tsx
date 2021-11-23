import { FC, useCallback, useState } from 'react';
import classNames from 'classnames';
import styles from './SearchInput.module.scss';
import { Icon } from '../Icon/Icon';

export interface SearchInputProps {
  value?: string;
  filterByLetter: (value: string) => void;
  filterLetter?: any;
}

/**
 * Main Logo component for user interaction
 */

const SearchInput: FC<SearchInputProps> = ({ filterByLetter, filterLetter }) => {
  return (
    <div className={styles.search__row}>
      <div className={styles.search__input}>
        <input value={filterLetter} placeholder="Поиск" 
          onChange={(e) => filterByLetter(e.target.value)} />
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
