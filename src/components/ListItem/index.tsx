import React, { useState , useEffect} from 'react';

export const AlistItem: React.FC<any> = (props) => {
  const [grid, setGrid] = useState<string>(localStorage.getItem('listItenGrid') || '1');
  
  const state =  localStorage.getItem('listItenGrid')
  useEffect(() =>{
    if(state == null){
      localStorage.setItem('listItenGrid','1')
    }
  },[state])
  
  const handleGrid = (grid:string) =>{
    props?.handleGrid()
    setGrid(grid)
    localStorage.setItem('listItenGrid',grid)
  }
  return (
      <div className='grid'>
      <label className={`el ${grid == '1' ? 'active' : ''}`} onClick={() => handleGrid('1')}>
        <input type='radio' name='grid' value={'1'} />
        <img src={require('Src/assets/grid_view_gray.png')} className='grid_view_gray' alt='' />
        <img src={require('Src/assets/grid_view_blue.png')} className='grid_view_black' alt='' />
      </label>
      <label className={`el ${grid == '2' ? 'active' : ''}`} onClick={() => handleGrid('2')}>
        <input type='radio' name='grid' value={'2'} />
        <img src={require('Src/assets/apps_gray.png')} className='apps_gray' alt='' />
        <img src={require('Src/assets/apps_blue.png')} className='apps_black' alt='' />
      </label>
    </div>
  )
}

export default AlistItem;