/**
 * @description 风格选择组件
 */

import React from 'react';
import { Image } from 'antd';

import styles from './style.scss';

interface IItem {
  label: string;
  value: string;
}
interface InspirationProps {
  onChange: (value: string) => void;
  value?: string;
  items: IItem[];
}



const Inspiration: React.FC<InspirationProps> = ({ onChange, value, items }) => {

  return (
    <div className={styles['inspiration-container']}>
      <span className={styles['inspiration-tag']}>涂鸦灵感</span>
      <div className={styles['inspiration-images']}>
        {items.map((item) => {
          return <img src={item.value} alt={item.label} onClick={() => { onChange(item.value) }} key={item.value}/>
        })}
      </div>

    </div>
  );
};

export default Inspiration;