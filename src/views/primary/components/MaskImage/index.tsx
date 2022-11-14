import React from 'react';
import { useTranslation } from 'react-i18next';

export const MaskImage = (props: any) => {
  const { t } = useTranslation();
  let { width, status } = props;
  const maskTitle = (status: number) => {
    if (status === 3) {
      return t('primary.soldOut');
    } else if (status === 2) {
      return t('primary.end');
    } else if (status === 0) {
      return t('primary.begin');
    } else {
      return '';
    }
  };
  return (
    <div className='spring-logo' style={{ width: width }}>
      <span>{maskTitle(status)}</span>
    </div>
  );
};
