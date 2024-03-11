import React from 'react'
import { FaRegQuestionCircle } from "react-icons/fa";
import { TbMessageReport } from "react-icons/tb";
import { IoSettingsOutline } from "react-icons/io5";
import { IoApps } from "react-icons/io5";
import Time from './time';
import Dates from './date';
import Authetication from './authentication';

const MobileHeader = () => {
  return (
     <>
      <div className='w-screen flex justify-around p-4'>
          <div className=' w-30 h-8 gap-2 flex items-center'>
            <div className='bg-purple-5 flex'>
              <Authetication />
            </div>
          </div>
        </div>
    
    </>
    
  )
}

export default MobileHeader