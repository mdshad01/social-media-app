import React from 'react'
import Sidebar from './Sidebar'
import LeftMenu from '../Home/LeftMenu'

const Settings = () => {
  return (
    <div className="flex flex-col ">
       <div className="flex">
       <div className="hidden md:block md:w-[30%] lg:w-[20%]">
      <Sidebar/>
        </div>
       </div>
    </div>
  )
}

export default Settings