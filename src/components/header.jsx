import React from 'react'
import { FaRegQuestionCircle } from "react-icons/fa";
import { TbMessageReport } from "react-icons/tb";
import { IoSettingsOutline } from "react-icons/io5";
import { IoApps } from "react-icons/io5";
import Time from './time';
import Dates from './date';
import Authetication from './authentication';
import logo from '../assets/logo.png'; 
const Header = () => {
  return (
     <>
      <div className='w-screen  flex justify-around  p-4 items-center md:pr-10 xl:pr-0 '>
        <img className='h-7 w-30'  src={logo} alt="Logo" />
        <div className='w-4/5 h-7  flex flex-nowrap justify-end xl:gap-0 gap-5'>
          <div className=' w-38 h-8 flex justify-center '>
            <div className='w-40 h-8 '>
                <Time />
            </div>
            <div className=' w-40 h-8 '>
                <Dates />
            </div>
          </div>
          <div className=' w-32 h-7 gap-2 flex justify-center xl:justify-end pt-1 '>
            <div className=''>
            <FaRegQuestionCircle className='text-gray-500 w-6 h-5 xl:h-6'/>
            </div>
            <div className=''>
            <TbMessageReport className='text-gray-500 w-6 h-5 xl:h-6 ' />
            </div>
            <div className=''>
            <IoSettingsOutline className='text-gray-500 w-6 h-5 xl:h-6 '/>
            </div>
          </div>
          <div className=' w-80  h-8 gap-4  flex items-center md:justify-end  lg:justify-end xl:justify-end lg:pr-24 md:pr-0  xl:pr-16 pl-6'>
            <div className=' w-7 h-8'>
            <IoApps className='text-gray-500 w-6 h-6 mt-1 ' />
            </div>
            <div className=' w-40 md:w-60 h-8 flex items-center'>
              <Authetication />
            </div>
          </div>
        </div>
      </div>
    </>
    
  )
}

export default Header