import React from 'react'
import { FaRegQuestionCircle } from "react-icons/fa";
import { TbMessageReport } from "react-icons/tb";
import { IoSettingsOutline } from "react-icons/io5";
import { IoApps } from "react-icons/io5";
import Time from './time';
import Dates from './date';
import Authetication from './authentication';
const Header = () => {
  return (
     <>
      <div className='w-full flex m-4'>
        <img className="w-30 h-8" src='../assets/logo.png' alt="   Logo" />
        <div className='w-5/6 h-7 flex flex-nowrap justify-end gap-10'>
          <div className=' w-50 h-8 gap-2 flex justify-center'>
            <div className='w-15 h-8'>
                <Time />
            </div>
            <div className=' w-25 h-8'>
                <Dates />
            </div>
          </div>
          <div className=' w-20 h-8 gap-2 flex justify-center'>
            <div className=' w-7 h-8'>
            <FaRegQuestionCircle className='text-gray-500'/>
            </div>
            <div className=' w-7 h-8'>
            <TbMessageReport className='text-gray-500' />
            </div>
            <div className=' w-7 h-8'>
            <IoSettingsOutline className='text-gray-500'/>
            </div>
          </div>
          <div className=' w-30 h-8 gap-2 flex justify-center'>
            <div className=' w-7 h-8'>
            <IoApps className='text-gray-500' />
            </div>
            <div className='bg-purple-50 w-50 h-8 flex'>
              <Authetication />
            </div>
          </div>
        </div>
      </div>
    </>
    
  )
}

export default Header