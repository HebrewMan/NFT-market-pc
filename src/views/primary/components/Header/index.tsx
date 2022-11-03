import React from 'react';
import './index.scss';
export const PHeader = (props: any) => {
  const { primaryObj } = props;
  return (
    <div className='primary-header'>
      <div className='primary-header-title'>
        <h1>{primaryObj.name}</h1>
        <p>{primaryObj.description}</p>
      </div>
    </div>
  );
};
