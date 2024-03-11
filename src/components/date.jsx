import React, { useState, useEffect } from 'react';

const Dates = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000); // Update every second

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const options = {
    weekday: 'short', // Specify the full weekday name
    month: 'short',   // Specify the full month name
    day: 'numeric'    // Specify the day of the month
  };

  return (
      <p className='text-gray-500  text-md text-center lg:text-lg xl:text-xl xl:text-end'>{currentDate.toLocaleDateString(undefined, options)}</p>
  );
};

export default Dates;
