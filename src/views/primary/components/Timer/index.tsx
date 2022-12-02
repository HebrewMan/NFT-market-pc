import React, { useState, useEffect } from 'react';
import useWindowDimensions from '../../../../utils/layout';
import './index.scss';
import { useTranslation } from 'react-i18next';

export const CommTimer = (props: any) => {
  // eslint-disable-next-line react/prop-types
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const { activityStatus, isSoldOut, small, isBought, endTime } = props;
  const stamps = endTime[0] * 24 * 60 * 60 + endTime[1] * 60 * 60 + endTime[2] * 60 + endTime[3];
  let [timeStamp, setTimeStamp] = useState(stamps);

  const currentStatus = () => {
    if (activityStatus === 0) {
      return t('primary.soldOut');
    } else if (activityStatus === 1) {
      return t('primary.progress');
    } else if (activityStatus === 2) {
      return t('primary.end');
    } else if (isSoldOut || activityStatus == 3) {
      return t('primary.soldOut');
    } else {
      return t('primary.progress');
    }
  };
  const computedTime = () => {
    if (timeStamp > 0) {
      timeStamp--;
      const days = Math.floor(timeStamp / 86400); // 天
      const hours = Math.floor((timeStamp / 3600) % 24); // 小时
      const minutes = Math.floor((timeStamp / 60) % 60); // 分钟
      const seconds = Math.floor(timeStamp % 60); // 秒
      setDownTime({ days, hours, minutes, seconds });
    } else {
      isActivityEnd();
    }
  };
  const isActivityEnd = () => {
    setDownTime({
      days: '0',
      hours: '0',
      minutes: '0',
      seconds: '0',
    });
  };
  const [timeEnd, setTimeEnd] = useState(false);
  const [downTime, setDownTime] = useState<any>({ days: '--', hours: '--', minutes: '--', seconds: '--' });
  const [mounted, setMounted] = useState(true);
  useEffect(() => {
    if (endTime?.length) {
      const days = endTime[0];
      const hours = endTime[1];
      const minutes = endTime[2];
      const seconds = endTime[3];
      setDownTime({ days, hours, minutes, seconds });
      init();
    }
    return function cleanup() {
      setMounted(false);
    };
  }, [endTime]);
  const init = () => {
    let timer: any;
    if (!isBought) {
      timer = setInterval(() => {
        computedTime();
        if (
          (downTime.days === '0' && downTime.hours === '0' && downTime.minutes === '0' && downTime.seconds === '0') ||
          activityStatus === 3 ||
          activityStatus === 2
        ) {
          setTimeEnd(true);
          clearInterval(timer);
        }
        if (!mounted) return;
      }, 1000);
    }
  };
  return (
    <div className='end-time'>
      <h3>{currentStatus()}</h3>
      <div className='mobile-end-time'>
        <div className={`box-timer ${small ? 'small-timer' : 'default-timer'}`}>
          <div>
            <span className={timeEnd ? 'disabled' : ''}>{downTime?.days}</span>
            <p className={timeEnd ? 'disabled' : ''}>{t('common.days')}</p>
          </div>
          <div>
            <span className={timeEnd ? 'disabled' : ''}>{downTime?.hours}</span>
            <p className={timeEnd ? 'disabled' : ''}>{t('common.hours')}</p>
          </div>
          <div>
            <span className={timeEnd ? 'disabled' : ''}>{downTime?.minutes}</span>
            <p className={timeEnd ? 'disabled' : ''}>{t('common.minutes')}</p>
          </div>
          <div>
            <span className={timeEnd ? 'disabled' : ''}>{downTime?.seconds}</span>
            <p className={timeEnd ? 'disabled' : ''}>{t('common.seconds')}</p>
          </div>
        </div>
        {width <= 1024 && (
          <div className='more'>
            <a> {t('primary.more')} → </a>
          </div>
        )}
      </div>
    </div>
  );
};
