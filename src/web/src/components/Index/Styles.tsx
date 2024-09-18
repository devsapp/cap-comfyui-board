/**
 * @description 风格选择组件
 */
import React, { useState } from 'react';
import type { MenuProps } from 'antd';
import { Button, Dropdown, Space, Tooltip } from 'antd';
import { UnorderedListOutlined } from '@ant-design/icons';
import paintLogo from '../../assets/imgs/O1CN01KdAd931IvtW46VM144.png';
import styles from './style.scss';
// 该组件的属性有 onChange, value, items

interface IItem {
  label: string;
  value: string;
  profile: string;
}
interface StylesProps {
  onChange: (value: string) => void;
  value?: string;
  items: IItem[];
}

const Styles: React.FC<StylesProps> = ({ onChange, value, items }) => {
  const [currentValue, setCurrentValue] = useState(value || '');
  const labelMap = items.reduce((pre: Record<string, string>, cur) => {
    pre[cur.value] = cur.label;
    return pre;
  }, {});
  const handleStyleChange: MenuProps['onClick'] = (info: any) => {
    const { key } = info;
    setCurrentValue(labelMap[key]);
    onChange(key);
  };

  return (
    <div className={styles['flex-row-container']} >
      <Dropdown
        menu={{
          items: items.map((item: IItem) => {
            return {
              key: item.value,
              label: <div style={{ display: 'flex', alignItems: 'center', height: 30 }}><img src={item.profile} style={{ width: 30, height: 30, marginRight: 4 }} /><span>{item.label}</span></div>
            }
          }),
          onClick: handleStyleChange,
        }}

        placement="bottom"
      >
        <Button type="text" className={[styles['title1'], styles['style-input-button']].join(' ')}  icon={<UnorderedListOutlined />} >
          {currentValue ?
            <Tooltip placement="top" title={currentValue} >
             {currentValue.length>2 ? `${currentValue.substring(0, 2)}..`: currentValue}
            </Tooltip>
            : '风格'}
        </Button>
      </Dropdown>
    </div>
  );
};

export default Styles;