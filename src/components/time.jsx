import React, { useState, useEffect } from 'react';
import Clock from 'react-clock';

const Time = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Cleanup the interval on component unmount
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array ensures the effect runs only once on mount

  const formattedTime = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    //<div className='text-gray-400 font-medium text-2xl'>
      <h2 className='text-gray-500  text-md text-center lg:text-lg xl:text-xl xl:text-end'>{formattedTime}</h2>
    //</div>
  );
};

export default Time;
