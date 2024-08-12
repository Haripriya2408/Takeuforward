import React, { useEffect, useState } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const BannerCard = ({ banner }) => {
  const [remainingTime, setRemainingTime] = useState(banner.remainingTime || 0);

  useEffect(() => {
    if (remainingTime > 0) {
      const interval = setInterval(() => {
        setRemainingTime((prevTime) => {
          const newTime = prevTime - 1000; // Decrease by 1 second (1000ms)
          return newTime >= 0 ? newTime : 0;
        });
      }, 1000);

      return () => clearInterval(interval); // Cleanup on unmount
    }
  }, [remainingTime]);

  const formatTime = (milliseconds) => {
    if (milliseconds <= 0) {
      return '00:00';
    }
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const initialTotalTime = banner.remainingTime > 0 ? banner.remainingTime : 1;
  const percentage = (remainingTime / initialTotalTime) * 100;
  const total=Math.floor(banner.timer);
  return (
    <div className="bg-gray-900 text-white rounded-md shadow-lg p-4 w-64 h-64 flex flex-col justify-between items-center">
      <div className="text-center">
        <h3 className="text-xl font-bold mb-2 truncate">{banner.description}</h3>
        <a
          href={banner.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-400 hover:underline break-all"
        >
          Link
        </a>
      </div>
      <div className="mt-4 flex flex-col items-center">
        <div style={{ width: 50, height: 50 }}>
          <CircularProgressbar
            value={percentage} // Progress from 100% to 0%
            text={formatTime(remainingTime)}
            styles={buildStyles({
              textSize: '24px',
              textColor: 'white',
              pathColor: 'green', // Green progress path
              trailColor: 'grey', // Grey background
              rotation: 0, // No rotation; starts at 12 o'clock position
            })}
          />
        </div>
        {remainingTime === 0 && (
          <p className="text-sm font-semibold text-red-500 mt-2">Finished in {total} seconds</p>
        )}
      </div>
    </div>
  );
};

export default BannerCard;
