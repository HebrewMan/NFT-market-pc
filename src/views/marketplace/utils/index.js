import dayjs from 'dayjs';
import i18n from 'i18next'

export function stopBubble(e) {
  if (e && e.stopPropagation) {
    e.stopPropagation();
  } else {
    window.event.cancelBubble = true;
  }
}

export function addHandler(element, type, handler) {
  if (element.addEventListener) {
    element.addEventListener(type, handler, false);
  } else if (element.attachEvent) {
    element.attachEvent('on' + type, handler);
  } else {
    element['on' + type] = handler;
  }
}

export function removeHandler(element, type, handler) {
  if (element.removeEventListener) {
    element.removeEventListener(type, handler, false);
  } else if (element.detachEvent) {
    element.detachEvent('on' + type, handler);
  } else {
    element['on' + type] = null;
  }
}

export const formatAdd = function (add) {
  if (!add || add.length < 10) {
    return add;
  }
  return add.substring(0, 6) + '****' + add.substring(add.length - 4);
};

export const formatTime = (time) => {
  const now = dayjs();
  const unix = dayjs(time).unix();
  const timestamp = unix * 1000;
  const inSeconds = now.diff(timestamp, 'second');
  const inMinutes = now.diff(timestamp, 'minute');
  const inHours = now.diff(timestamp, 'hour');
  const inDays = now.diff(timestamp, 'day');
  const inMonths = now.diff(timestamp, 'month');
  const inYear = now.diff(timestamp, 'year');
  if (inYear >= 1) {
    const str = i18n.t('common.yearAgo', { num: Math.abs(inYear), plural: inYear === 1 ? '' : 's' });
    return str;
  }else if(inMonths > 0) {
    const str = i18n.t('common.monthAgo', { num: Math.abs(inMonths), plural: inMonths === 1 ? '' : 's' });
    return str;
  } else if (inHours >= 24) {
    const str = i18n.t('common.dayAgo', { num: Math.abs(inDays), plural: inDays === 1 ? '' : 's' });
    return str;
  } else if (inMinutes >= 60) {
    const str = i18n.t('common.hourAgo', { num: Math.abs(inHours), plural: inHours === 1 ? '' : 's' });
    return str;
  } else if (inSeconds >= 60) {
    const str = i18n.t('common.minuteAgo', { num: Math.abs(inMinutes), plural: inMinutes === 1 ? '' : 's' });
    return str;
  } else {
    const str = i18n.t('common.secondAgo', { num: Math.abs(inSeconds), plural: inSeconds === 1 ? '' : 's' });
    return str;
  }
};
