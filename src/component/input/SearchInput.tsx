import { FC, useCallback, useState } from 'react';
import classNames from 'classnames';
import styles from './SearchInput.module.scss';
import { Icon } from '../Icon/Icon';

export interface SearchInputProps {
  value?: string;
}

/**
 * Main Logo component for user interaction
 */

const SearchInput: FC<SearchInputProps> = ({ value }) => {
  const [val, setValue] = useState(value);
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = useCallback((e) => setValue(e.target.value), [val]);
  const handleRemove = useCallback(() => setValue(''), [val]);

  return (
    <div className={styles.search__row}>
      <div className={styles.search__input}>
        <input type="text" onChange={handleChange} value={val} placeholder="Поиск" />
        <button type="button" className={styles.remove_btn} onClick={handleRemove}>
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
