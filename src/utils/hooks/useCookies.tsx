import { useState } from 'react';

type returnType = readonly [string, (value: string, numberOfDays: string | number) => void];

type UseCookies = (key: string, defaultValue?: string) => returnType;

/**
 *
 * @param {String} key The key to store our data to
 * @param {String} defaultValue The default value to return in case the cookie doesn't exist
 */

const useCookie: UseCookies = (key, defaultValue) => {
  const getCookie = () => getItem(key) || defaultValue;
  const [cookie, setCookie] = useState(getCookie());

  const updateCookie = (value, numberOfDays) => {
    setCookie(value);
    setItem(key, value, numberOfDays);
  };

  return [cookie, updateCookie];
};

function getItem(key) {
  return document.cookie.split('; ').reduce((total, currentCookie) => {
    const item = currentCookie.split('=');
    const storedKey = item[0];
    const storedValue = item[1];

    return key === storedKey ? decodeURIComponent(storedValue) : total;
  }, '');
}

function setItem(key, value, numberOfDays) {
  const now = new Date();

  // set the time to be now + numberOfDays
  now.setTime(now.getTime() + numberOfDays * 60 * 60 * 24 * 1000);

  document.cookie = `${key}=${value}; expires=${now.toUTCString()}; path=/`;
}

export default useCookie;
