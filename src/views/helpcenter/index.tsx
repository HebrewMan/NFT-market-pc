import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { HeaderSearch } from '../../components/HeaderSearch'
import { getAllCategories } from '../../api/artiles'
import { getViewLang } from "../../utils/i18n"
import { Collapse } from 'antd'
const { Panel } = Collapse
import './index.scss'
const src1 = require('Src/assets/marketPlace/Icon-down.svg')
const src2 = require('Src/assets/marketPlace/Icon-up.svg')

export const HelpCenter = () => {
  const [categoriesList, setCategoriesList] = useState([])
  const [name, setName] = useState('')
  const history = useHistory()
  const handleToArticle = (id: number) => {
    history.push(`/article-details/${id}`)
  }
  useEffect(() => {
    initCategories()
  }, [name])
  // 初始化分类列表
  const initCategories = async () => {
    const res: any = await getAllCategories({ name: name })
    setCategoriesList(res.data.records)
  }
  return (
    <div className='help-center-main content-wrap-top'>
      <div className='main'>
        <div className='main-banner'>Help Center</div>
        <div className='main-wrapper'>
          <div className='wrapper-list'>
            <Collapse ghost expandIconPosition="end" expandIcon={({ isActive }) => <img src={isActive ? src2 : src1} alt='' />}>
              {categoriesList.map((item: any) => (

                <Panel header={getViewLang(item.inName)} key={item.id}>
                  <ul>
                    {item.articleList.map((cItem: any) => (

                      <li key={cItem.id} onClick={() => handleToArticle(cItem.id)}>
                        {getViewLang(cItem.inName)}
                      </li>
                    ))}
                  </ul>
                </Panel>
              ))}

            </Collapse>
          </div>
        </div>
      </div>
    </div>
  )
}
