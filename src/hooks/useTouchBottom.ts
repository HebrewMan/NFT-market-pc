import { useEffect, useRef } from 'react';
import { throttle } from 'lodash';

const isTouchBottom = (handler: any) => {
  // 文档显示区域高度
  const showHeight = window.innerHeight;
  // 网页卷曲高度
  const scrollTopHeight = document.body.scrollTop || document.documentElement.scrollTop;
  // 所有内容高度
  const allHeight = document.body.scrollHeight || document.documentElement.scrollHeight;
  // (所有内容高度 = 文档显示区域高度 + 网页卷曲高度) 时即为触底
  if (allHeight <= showHeight + scrollTopHeight && allHeight >= 969) {
    handler();
  }
};

export const useTouchBottom = (func: any, page: number, isMore: any) => {
  const useFn = throttle(() => {
    if (typeof func === 'function') {
      isTouchBottom(func);
    }
  }, 500);
  useEffect(() => {
    window.addEventListener('scroll', useFn);
    return () => {
      window.removeEventListener('scroll', useFn);
    };
  }, []);

  const pageRef: any = useRef(null);
  useEffect(() => {
    pageRef.current = page;
  }, [page]);

  const isMoreRef: any = useRef(null);
  useEffect(() => {
    isMoreRef.current = isMore;
  }, [isMore]);

  if (isMoreRef.current) {
    page = pageRef.current + 1;
  } else {
    pageRef.current = 1;
  }
  return { pageRef, isMoreRef };
};
