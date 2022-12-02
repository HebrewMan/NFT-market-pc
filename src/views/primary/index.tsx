import React from "react"
import { PHeader } from "./components/Header"
import { PList } from "./components/List"
import { useTranslation } from 'react-i18next';

export const Primary = () => {
  const {t} = useTranslation()
  const primaryObj = {
    name: t('primary.title'),
    description:t('primary.titleInfo')
  }
  return (
    <div className="primary-market-wrap">
      <PHeader primaryObj={primaryObj} />
      <PList />
    </div>
  )
}
