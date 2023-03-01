import React, { ReactNode } from 'react'
import './index'
import { Empty } from 'antd'
import { useTranslation } from 'react-i18next'


const AEmpty: React.FC<IProps> = (props: any) => {
  const { t } = useTranslation()
  const NO_DATA_IMG = require('Src/assets/common/empty.png')
  const {
    description = t('common.noDataLong'),
    image = NO_DATA_IMG,
    imageStyle = { height: 90, },
    style,
    ...rest
  } = props

  const myStyle = {
    paddingTop: '80px',
    height: '220px',
    width: '100%',
    ...style,
  }

  return (
    <Empty
      className="emptyWaper"
      image={image}
      description={description}
      imageStyle={imageStyle}
      style={myStyle}
      {...rest}
    >
      {props?.children}
    </Empty>
  )
}

interface IProps {
  image?: string | ReactNode,
  description?: string | ReactNode,
  imageStyle?: any,
  className?: string,
  style?: any,
}

export default AEmpty
