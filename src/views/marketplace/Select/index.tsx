import React, { useEffect, useRef, useState } from 'react'
import { addHandler, stopBubble, removeHandler } from '../utils'
import './index.scss'
import { useTranslation } from 'react-i18next'
interface activeItemProps {
  name: string
  headUrl: string
}
export const Select = (props: any) => {
  const { t } = useTranslation()
  const { placeholder = t('common.pleaseChoose'), list = [], change, value, reset } = props

  const [isOpen, setIsOpen] = useState(false)
  const [activeItem, setActiveItem] = useState<activeItemProps>({ name: '', headUrl: '' })
  const gselect: any = useRef()
  const toggle = (e: any) => {
    e.stopPropagation()
    e.nativeEvent.stopImmediatePropagation()
    isOpen ? hide(e) : show()
  }
  const show = () => {
    setIsOpen(true)
    setTimeout(() => {
      addHandler(document, 'click', hide)
    }, 100)
  }
  const hide = (e: any) => {
    setIsOpen(false)
    if (gselect?.current?.contains(e.target)) {
      stopBubble(e)
    }
    removeHandler(document, 'click', hide)
  }
  const check = (e: any, item: any) => {
    setActiveItem(item)
    change(item)
    toggle(e)
  }
  const findItem = () => {
    const el = list.find((item: any) => item.id == value || item.value == value)
    setActiveItem(el || {})
  }
  useEffect(() => {
    if (value) {
      findItem()
    }
  }, [value, list])
  useEffect(() => {
    setActiveItem({ name: '', headUrl: '' })
  }, [reset])
  const MapList = () => {
    if (isOpen) {
      return list.map((item: any, index: number) => (
        <div className='item' key={index} onClick={(e) => check(e, item)}>
          {item.headUrl && (
            <div className='img'>
              <img src={item.headUrl} alt='' />
            </div>
          )}
          <span> {item.name}</span>
        </div>
      ))
    }
  }
  return (
    <div className='g-select' ref={gselect}>
      <div className='g-select--header' onClick={toggle}>
        <div className='main'>
          {activeItem.headUrl && (
            <div className='img'>
              <img src={activeItem.headUrl} alt='' />
            </div>
          )}

          <div className={activeItem.name ? 'g-title' : 'placeholder-title'}>{activeItem.name || placeholder}</div>
        </div>
        <img
          src={!isOpen ? require('Src/assets/marketPlace/Icon-down.svg') : require('Src/assets/marketPlace/Icon-up.svg')}
          alt=''
        />
      </div>
      <div className={`g-select--options`}>{MapList()}</div>
    </div>
  )
}
