/**
 * @description 风格选择组件
 */

import React from 'react';
import { Input } from 'antd';
import styles from './style.scss';


interface PromptProps {
  onChange: (value: string) => void;
  value?: string;
}

const Prompt: React.FC<PromptProps> = ({ onChange, value }) => {

  return (
    <div className={styles['flex-row-container']} >
      <span className={styles['title1']} >提示词</span>
      <Input
        className={styles['prompt-input']}
        placeholder='猫，毛绒，可爱'
        value={value}
        onChange={(e: any) => onChange(e)} />
    </div>
  );
};

export default Prompt;