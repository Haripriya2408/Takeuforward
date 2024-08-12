import React, { useState, useEffect } from 'react';

const BannerCard = ({ banner }) => {
  const [timeLeft, setTimeLeft] = useState(banner.remainingTime);
  const [dashOffset, setDashOffset] = useState(0);

  const radius = 50; // Radius of the circular countdown
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
      const remainingTime = banner.remainingTime - elapsedTime;

      if (remainingTime <= 0) {
        clearInterval(timer);
        setTimeLeft(0);
      } else {
        setTimeLeft(remainingTime);
        setDashOffset(circumference * (elapsedTime / banner.remainingTime));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [banner.remainingTime, circumference]);

  if (timeLeft === 0) return <p className="text-xl font-bold text-red-500">Time Ended</p>;

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
          {banner.link}
        </a>
      </div>
      <div className="mt-4 flex flex-col items-center">
        <div className="relative inline-block">
          <svg className="transform -rotate-90" width="120" height="120">
            <circle
              cx="60"
              cy="60"
              r={radius}
              stroke="white"
              strokeWidth="8"
              fill="transparent"
              opacity="0.3"
            />
            <circle
              cx="60"
              cy="60"
              r={radius}
              stroke="yellow"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-linear"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-xl font-bold">
            {timeLeft}s
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerCard;
