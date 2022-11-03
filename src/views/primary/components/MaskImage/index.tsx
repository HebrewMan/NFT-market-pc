import React from 'react';

export const MaskImage = (props: any) => {
  let { width, status } = props;
  const maskTitle = (status: number) => {
    if (status === 3) {
      return 'Sold Out';
    } else if (status === 2) {
      return 'End';
    } else if (status === 0) {
      return 'To Begin';
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
