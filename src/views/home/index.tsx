import React, { useEffect } from 'react';
import { Trending } from './Trending';
import { SubjectInner } from './SubjectInner';
import { SetupDetails } from './SetupDetails';
import { Resources } from './Resources';
import './index.scss';
export const HsHome = () => {
  return (
    <div className='home-container'>
      <SubjectInner />
      <div className={`home-container-wrap`}>
        <Trending />
        <SetupDetails />
        <Resources />
      </div>
    </div>
  );
};
