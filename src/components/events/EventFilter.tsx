import React from 'react';
import { SearchIcon, FilterIcon } from 'lucide-react';

// Define the props and filter type
interface EventFilterProps {
filters: {
search: string;
category: string;
date: string;
location: string;
};
onFilterChange: (name: string, value: string) => void;
}

const EventFilter: React.FC<EventFilterProps> = ({ filters, onFilterChange }) => {
const categories = [
'All Categories',
'Music',
'Technology',
'Food & Drink',
'Arts & Culture',
'Sports',
'Business',
];

return (
<div className="bg-white rounded-lg shadow-md p-6">
<div className="flex flex-col md:flex-row gap-4">

    {/* 🔍 Search Input */}
    <div className="flex-grow">
      <div className="relative">
        <input
          type="text"
          placeholder="Search events..."
          className="w-full py-3 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={filters.search}
          onChange={(e) => onFilterChange('search', e.target.value)}
        />
        <SearchIcon className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
      </div>
    </div>

    {/* 🏷️ Category Filter */}
    <div className="md:w-56">
      <select
        className="w-full py-3 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        value={filters.category}
        onChange={(e) => onFilterChange('category', e.target.value)}
      >
        {categories.map((category) => (
          <option key={category} value={category === 'All Categories' ? '' : category}>
            {category}
          </option>
        ))}
      </select>
    </div>

    {/* 📅 Date Filter */}
    <div className="md:w-40">
      <input
        type="date"
        className="w-full py-3 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        value={filters.date}
        onChange={(e) => onFilterChange('date', e.target.value)}
      />
    </div>

    {/* 📍 Location Input */}
    <div className="md:w-56">
      <input
        type="text"
        placeholder="Location..."
        className="w-full py-3 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        value={filters.location}
        onChange={(e) => onFilterChange('location', e.target.value)}
      />
    </div>

    {/* ⚙️ Filter Button */}
    <button
      className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-lg flex items-center justify-center"
      onClick={() => console.log('Filters applied:', filters)}
    >
      <FilterIcon className="h-5 w-5 mr-2" />
      Filter
    </button>
  </div>
</div>


);
};

export default EventFilter;