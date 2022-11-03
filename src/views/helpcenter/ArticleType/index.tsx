import React, { useEffect, useState } from 'react';
import { Link, useHistory, useLocation, useParams } from 'react-router-dom';
import { getArticlesByCategories } from '../../../api/artiles';
import './index.scss';

const linkUtils = (path: any) => {
  const link = path.split('/', 2)[1].split('-')[1];
  return link;
};
export const Nav = () => {
  const { name } = useParams() as any;
  const location = useLocation();
  const toggleRouter = () => {
    if (linkUtils(location.pathname) === 'details') {
      return history.go(-1);
    }
    window.location.reload();
  };
  return (
    <div className='main-breadcrumb'>
      <div className='breadcrumb'>
        <Link to={`/helpcenter`}>HelpCenter</Link>
        <span></span>
        <a onClick={() => toggleRouter()}>{name}</a>
      </div>
    </div>
  );
};
export const ArticleType = () => {
  const [articles, setArticles] = useState([]);
  const history = useHistory();
  const { name, id } = useParams() as any;

  useEffect(() => {
    const initArticles = async () => {
      const res: any = await getArticlesByCategories({ categoryId: id });
      setArticles(res.data.records);
      localStorage.setItem('list', JSON.stringify(res.data.records));
    };
    initArticles();
  }, [id]);
  return (
    <div className='article-main'>
      <Nav />
      <div className='main-inner'>
        <div className='inner'>
          <h1>{name}</h1>
          <ul>
            {articles.map((item: any) => (
              <li key={item.id} onClick={() => history.push(`/article-details/${name}/${item.id}`)}>
                {item.readCount > 1 && <img src='/sol/star_black.svg' className='svg-default-size' alt='' />}
                {item.title}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
