import { FC } from 'react';
import classNames from 'classnames';
import styles from './MainInput.module.scss';
import { Icon } from '../Icon/Icon';

interface TrashInputNavbarProps {
  isLogin?: boolean;
  withHistory?: boolean;
  ontoggle?: () => void;
}

export const TrashInputNavbar: FC<TrashInputNavbarProps> = ({ isLogin, withHistory, ontoggle }) => {
  return (
    <div className={classNames(styles.input_navbar)}>
      <div className={classNames(styles.main_tools)}>
        <button type="button" className={styles.icon_btn}>
        <svg viewBox="0 0 91 91" xmlns="http://www.w3.org/2000/svg">
          <g transform="scale(1.4)"><path d="M67.305,36.442v-8.055c0-0.939-0.762-1.701-1.7-1.701H54.342v-5.524c0-0.938-0.761-1.7-1.699-1.7h-12.75   c-0.939,0-1.701,0.762-1.701,1.7v5.524H26.93c-0.939,0-1.7,0.762-1.7,1.701v8.055c0,0.938,0.761,1.699,1.7,1.699h0.488v34.021   c0,0.938,0.761,1.7,1.699,1.7h29.481c3.595,0,6.52-2.924,6.52-6.518V38.142h0.486C66.543,38.142,67.305,37.381,67.305,36.442z    M41.592,22.862h9.35v3.824h-9.35V22.862z M61.719,67.345c0,1.719-1.4,3.117-3.12,3.117h-27.78v-32.32l30.9,0.002V67.345z    M63.904,34.742H28.629v-4.655h11.264h12.75h11.262V34.742z"/><rect height="19.975" width="3.4" x="36.066" y="44.962"/><rect height="19.975" width="3.4" x="44.566" y="44.962"/><rect height="19.975" width="3.4" x="53.066" y="44.962"/></g></svg>
        </button>
        <button type="button" style={{paddingBottom: "4px"}} className={styles.icon_btn}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 331.708 331.708" >
          <g transform="scale(1)">
            <path d="M222.685,284.287H47.419V109.02h102.502l47.421-47.419H5c-2.761,0-5,2.239-5,5v260.105c0,2.761,2.239,5,5,5h260.104 c2.761,0,5-2.239,5-5v-192.34l-47.419,47.418V284.287z"/>
            <path d="M330.244,1.467c-1.149-1.149-2.783-1.671-4.387-1.391L194.44,22.786c-1.84,0.318-3.35,1.635-3.915,3.415 c-0.564,1.78-0.09,3.727,1.23,5.047l30.971,30.971l-79.517,79.516c-1.953,1.953-1.953,5.119,0,7.071l39.688,39.689 c0.938,0.938,2.21,1.464,3.536,1.464c1.326,0,2.598-0.527,3.536-1.464l79.517-79.516l30.97,30.971 c1.32,1.32,3.268,1.794,5.047,1.23c1.78-0.564,3.097-2.074,3.414-3.915L331.634,5.854C331.912,4.253,331.393,2.617,330.244,1.467z"/>
          </g>
          </svg>
        </button>
      </div>
    </div>
  );
};
