import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { HeaderSearch } from '../../components/HeaderSearch';
import { getAllCategories } from '../../api/artiles';
import { Collapse } from 'antd';
const { Panel } = Collapse;
import './index.scss';

export const HelpCenter = () => {
  const [categoriesList, setCategoriesList] = useState([]);
  const [name, setName] = useState('');
  const history = useHistory();
  const handleToArticle = (name: string, id: number) => {
    history.push(`/article-details/${name}/${id}`);
  };
  const handleGetKeyWord = (value: string) => {
    setName(value);
  };
  useEffect(() => {
    initCategories();
  }, [name]);
  // 初始化分类列表
  const initCategories = async () => {
    const res: any = await getAllCategories({ name: name });
    setCategoriesList(res.data.records);
  };
  return (
    <div className='help-center-main'>
      <div className='main'>
        <div className='main-banner'></div>
        <div className='main-wrapper'>
          <div className='wrapper-list'>
            <Collapse ghost>
              {categoriesList.map((item: any) => (
                <Panel header={item.name} key={item.id}>
                  <ul>
                    {item.articleList.map((cItem: any) => (
                      <li key={cItem.id} onClick={() => handleToArticle(item.name, cItem.id)}>
                        {cItem.title}
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
  );
};
