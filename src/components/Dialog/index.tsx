import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import Dialog from './Dialog';
import './index.scss';

const Portal = (props: any) => {
  const { content } = props;
  const div = document.createElement('div');
  document.body.appendChild(div);
  useEffect(() => {
    return () => {
      document.body.removeChild(div);
    };
  }, [props.visible]);

  return <div>{createPortal(<Dialog {...props}>{content}</Dialog>, div)}</div>;
};

export default Portal;
