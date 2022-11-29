import React from 'react';
import './index.scss';
import { getViewLang } from '../../../../utils/i18n';
export const PHeader = (props: any) => {
  const { primaryObj } = props;
  
  return (
    <div className='primary-header'>
      <div className='primary-header-title'>
        <h1>{getViewLang(primaryObj?.name)}</h1>
        <p>{getViewLang(primaryObj?.description)}</p>
      </div>
    </div>
  );
};
