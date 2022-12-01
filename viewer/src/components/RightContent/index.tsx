import {Space} from 'antd';
import React from 'react';
import { useModel, SelectLang } from 'umi';
import styles from './index.less';
import Avatar from './AvatarDropdown';

export type SiderTheme = 'light' | 'dark';

const GlobalHeaderRight: React.FC = () => {
  const { initialState } = useModel('@@initialState');

  if (!initialState || !initialState.settings) {
    return null;
  }

  const { navTheme, layout } = initialState.settings;
  let className = styles.right;

  // @ts-ignore
  if ((navTheme === 'dark' && layout === 'top') || layout === 'mix') {
    className = `${styles.right}  ${styles.dark}`;
  }
  return (
    <Space size={'small'} className={className}>
       <Avatar />
       <SelectLang className={styles.action} />
    </Space>
  );
};
export default GlobalHeaderRight;
