import React, { useState, useEffect } from 'react';

const Timer = ({ startTime, onTimeUpdate }) => {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (startTime) {
      const [startHours, startMinutes, startSeconds] = startTime.split(':').map(Number);
      setHours(startHours);
      setMinutes(startMinutes);
      setSeconds(startSeconds);
    }

    const timer = setInterval(() => {
      setSeconds(prevSeconds => {
        const newSeconds = prevSeconds === 59 ? 0 : prevSeconds + 1;
        if (newSeconds === 0) {
          setMinutes(prevMinutes => {
            const newMinutes = prevMinutes === 59 ? 0 : prevMinutes + 1;
            if (newMinutes === 0) {
              setHours(prevHours => prevHours + 1);
            }
            return newMinutes;
          });
        }
        return newSeconds;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime]);

  useEffect(() => {
    if (onTimeUpdate) {
      onTimeUpdate(hours * 3600 + minutes * 60 + seconds);
    }
  }, [hours, minutes, seconds, onTimeUpdate]);

  return (
    <div className='text-black font-bold'>
      {hours > 0 ? (
        <div>{`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}</div>
      ) : (
        <div>{`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}</div>
      )}
    </div>
  );
};

export default Timer;
