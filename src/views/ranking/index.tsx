import React, { useEffect } from 'react'
import { Ranking } from 'Src/components/Ranking'
import './index.scss'
export const RankingView = () => {
  return (
    <div className='content-wrap-top'>
      <div className='ranKing-waper'>
        <div className='ranKing-title'>交易排行</div>
        <div className='ranKing-tips'>实时追踪地板价、交易量等数据，快速找到近期的热门集合</div>
        <div className='ranking-list'>
          <Ranking paginationBoolean={true} />
        </div>
      </div>
    </div>
  )
}

