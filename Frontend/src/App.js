import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Dashboard from './components/DashBoard';
import BannerCard from './components/BannerCard';

function App() {
  const [banners, setBanners] = useState([]);
  const [isBannerVisible, setIsBannerVisible] = useState(false);

  useEffect(() => {
    if (isBannerVisible) {
      axios.get('http://localhost:5000/banners')
        .then(response => {
          const updatedBanners = response.data.map(banner => {
            const now = new Date().getTime();
            const endTime = new Date(banner.endTime).getTime();
            if (endTime > now) {
              banner.remainingTime = endTime - now;
            } else {
              banner.remainingTime = 0;
            }
            return banner;
          });
          setBanners(updatedBanners);
        })
        .catch(error => console.error('Error fetching banners:', error));
    }
  }, [isBannerVisible]);

  const handleUpdateBanner = (newBanner) => {
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + newBanner.timer * 1000);

    axios.post('http://localhost:5000/banners', { ...newBanner, startTime, endTime })
      .then(response => {
        const updatedBanner = { ...newBanner, id: response.data.id, startTime, endTime };
        setBanners(prevBanners => [...prevBanners, updatedBanner]);
      })
      .catch(error => console.error('Error saving banner:', error));
  };

  return (
    <div className="bg-gray-800 min-h-screen text-white flex flex-col justify-center items-center relative">
      <div className="absolute top-4 right-4">
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={isBannerVisible}
            onChange={(e) => setIsBannerVisible(e.target.checked)}
          />
          <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-red-300 dark:peer-focus:ring-red-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-red-600"></div>
        </label>
        <span className="ml-2 text-sm font-medium text-gray-400">Show Banners</span>
      </div>

      <h1 className="text-4xl font-bold mt-8">TakeUForward Banner</h1>

      {isBannerVisible ? (
        <div className="mt-10 flex flex-wrap gap-4 items-center justify-center w-full">
          {banners.map((banner) => (
            <BannerCard key={banner.id} banner={banner} />
          ))}
        </div>
      ) : (
        <Dashboard onUpdateBanner={handleUpdateBanner} />
      )}
    </div>
  );
}

export default App;

