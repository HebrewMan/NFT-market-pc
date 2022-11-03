import dayjs from 'dayjs';
// import utc from "dayjs/plugin/utc";
// dayjs.extend(utc);
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
  const getStr = (num, mark) => {
    return `${Math.abs(num)} ${mark}${num === 1 ? '' : 's'} ago`;
  };
  if (inMonths > 0) {
    return getStr(inMonths, 'day');
  } else if (inHours >= 24) {
    return getStr(inDays, 'day');
  } else if (inMinutes >= 60) {
    return getStr(inHours, 'hour');
  } else if (inSeconds >= 60) {
    return getStr(inMinutes, 'minute');
  } else {
    return getStr(inSeconds, 'second');
  }
};
