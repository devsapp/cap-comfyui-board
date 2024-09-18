/**
 * @description 风格选择组件
 */

import React from 'react';
import { Select } from 'antd';
import { RATIO_OPTOPNS } from './constants';
import styles from './style.scss';


interface PromptProps {
    onChange: (value: string) => void;
    value?: string;
}



const Ratio: React.FC<PromptProps> = ({ onChange, value }) => {

    return (
        <div className={styles['flex-row-container']} >
            <span className={styles['title1']} >分辨率</span>
            <Select
                value={value}
                className={styles['ratio-input']}
                onChange={onChange}
                options={RATIO_OPTOPNS}

            />
        </div>
    );
};

export default Ratio;