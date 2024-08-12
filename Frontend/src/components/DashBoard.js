import React, { useState } from 'react';

const Dashboard = ({ onUpdateBanner }) => {
  const [description, setDescription] = useState('');
  const [timer, setTimer] = useState();
  const [link, setLink] = useState('');
  const [isVisible, setIsVisible] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!description || !link || !Number.isInteger(Number(timer))) {
      alert('Please fill in all fields correctly.');
      return;
    }

    onUpdateBanner({ description, timer: Number(timer), link, is_visible: isVisible });
    setDescription('');
    setTimer('');
    setLink('');
    setIsVisible(true);
  };

  return (
    <div className="p-6 bg-gray-900 text-white rounded-md shadow-lg max-w-4xl w-full mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6">Create New Banner</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-400">Banner Description:</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full p-2 bg-gray-700 border border-gray-600 rounded-md"
            placeholder="Enter banner description"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-400">Timer (seconds):</label>
          <input
            type="number"
            value={timer}
            onChange={(e) => setTimer(Number(e.target.value))}
            className="mt-1 block w-full p-2 bg-gray-700 border border-gray-600 rounded-md"
            placeholder="Enter countdown timer in seconds"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-400">Link:</label>
          <input
            type="text"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="mt-1 block w-full p-2 bg-gray-700 border border-gray-600 rounded-md"
            placeholder="Enter banner link"
          />
        </div>
       
        <button
          type="submit"
          className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition duration-200"
        >
          Submit Banner
        </button>
      </form>
    </div>
  );
};

export default Dashboard;
