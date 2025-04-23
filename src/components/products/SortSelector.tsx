
import React from 'react';

interface SortSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const SortSelector: React.FC<SortSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="flex justify-end mb-4">
      <select 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        className="bg-[#222222] text-white border border-gray-700 rounded-md px-3 py-1 text-sm"
      >
        <option value="default">Sort By</option>
        <option value="priceAsc">Price: Low to High</option>
        <option value="priceDesc">Price: High to Low</option>
        <option value="incomeAsc">Income: Low to High</option>
        <option value="incomeDesc">Income: High to Low</option>
        <option value="popularity">Popularity</option>
      </select>
    </div>
  );
};

export default SortSelector;
