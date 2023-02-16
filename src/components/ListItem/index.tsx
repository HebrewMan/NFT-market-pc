import React, { useState, useEffect } from 'react'
import './index.scss'

export const AlistItem: React.FC<any> = (props) => {
  const [grid, setGrid] = useState<string>(localStorage.getItem('listItenGrid') || '1')

  const state = localStorage.getItem('listItenGrid')
  useEffect(() => {
    if (state == null) {
      localStorage.setItem('listItenGrid', '1')
    }
  }, [state])

  const handleGrid = (grid: string) => {
    props?.handleGrid()
    setGrid(grid)
    localStorage.setItem('listItenGrid', grid)
  }
  return (
    <div className='grid'>
      <label className={`el ${grid == '1' ? 'active' : ''}`} onClick={() => handleGrid('1')}>
        <input type='radio' name='grid' value={'1'} />
        <img src={require('Src/assets/marketPlace/grid_view_gray.svg')} className='grid_view_gray' alt='' />
        <img src={require('Src/assets/marketPlace/grid_view_blue.svg')} className='grid_view_black' alt='' />
      </label>
      <label className={`el ${grid == '2' ? 'active' : ''}`} onClick={() => handleGrid('2')}>
        <input type='radio' name='grid' value={'2'} />
        <img src={require('Src/assets/marketPlace/apps_gray.svg')} className='apps_gray' alt='' />
        <img src={require('Src/assets/marketPlace/apps_blue.svg')} className='apps_black' alt='' />
      </label>
    </div>
  )
}

export default AlistItem