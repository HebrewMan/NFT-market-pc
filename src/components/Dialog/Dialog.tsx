/**
 * @param props
 *        visible 弹窗是否显示的状态（Boolean）
 *        title 弹窗标题
 *        children 内容区域
 *        close 为关闭弹窗回调
 *        checked 操作确认回调
 * @returns
 */
import React from 'react';
import { useTranslation } from 'react-i18next';

export default function Dialog(props: any) {
  const {t} = useTranslation()
  return (
    props.visible && (
      <div className={`dialog-container ${props.visible ? 'container-enter' : ''}`}>
        <div className='container'>
          <div className='header-title'>
            <h4>{props.title || ''}</h4>
          </div>
          <div className='content dialog-body'>{props.children}</div>
          <div className='btn'>
            <button className='btn-default' onClick={() => props.close()}>
              {props.closeText || t('common.cofirm')}
            </button>
            <button className='btn-primary' onClick={() => props.checked()}>
              {props.checkedText || t('common.cancel')}
            </button>
          </div>
          <div className='close-btn' onClick={() => props.close()}>
            <img src={require('../../assets/close.svg')} alt='' />
          </div>
        </div>
      </div>
    )
  );
}
