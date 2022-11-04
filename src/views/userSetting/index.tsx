import React from 'react';
import { General } from './General';
import './index.scss';

export const UserSetting = () => {
  return (
    <div className='user-settings'>
      <div className={`settings-wrap`}>
        <div className='settings-list'>
          <ul>
            <div className='list-title'>SETTINGS</div>
            <li>
              <a className='li-item actived'>
                <span>General</span>
              </a>
            </li>
          </ul>
        </div>
        <div className='settings-container'>
          <h1>General Settings</h1>
          <General />
        </div>
      </div>
    </div>
  );
};
