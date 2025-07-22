import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiCheck, FiX, FiSearch, FiFilter } = FiIcons;

const AllSelectors = ({ results }) => {
  const [activeSection, setActiveSection] = useState('used');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Combine all selectors from all CSS files
  const allUsedSelectors = results.cssFiles.reduce((acc, file) => {
    return [...acc, ...file.usedSelectors.map(selector => ({
      selector,
      file: file.url
    }))];
  }, []);

  const allUnusedSelectors = results.cssFiles.reduce((acc, file) => {
    return [...acc, ...file.unusedSelectors.map(selector => ({
      selector,
      file: file.url
    }))];
  }, []);

  // Filter based on search query and type
  const filteredSelectors = (activeSection === 'used' ? allUsedSelectors : allUnusedSelectors)
    .filter(item => {
      const matchesSearch = searchQuery === '' || 
        item.selector.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.file.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (filterType === 'all') return matchesSearch;
      if (filterType === 'class') return matchesSearch && item.selector.startsWith('.');
      if (filterType === 'id') return matchesSearch && item.selector.startsWith('#');
      if (filterType === 'tag') {
        const isTag = /^[a-z][a-z0-9]*($|[^-_a-z0-9])/i.test(item.selector);
        return matchesSearch && isTag;
      }
      return matchesSearch;
    });

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveSection('used')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-2 ${
              activeSection === 'used'
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-600 hover:text-gray-800'
            }`}
          >
            <SafeIcon icon={FiCheck} className="h-4 w-4" />
            <span>Used ({allUsedSelectors.length})</span>
          </button>
          <button
            onClick={() => setActiveSection('unused')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-2 ${
              activeSection === 'unused'
                ? 'bg-red-100 text-red-800'
                : 'bg-gray-100 text-gray-600 hover:text-gray-800'
            }`}
          >
            <SafeIcon icon={FiX} className="h-4 w-4" />
            <span>Unused ({allUnusedSelectors.length})</span>
          </button>
        </div>
        
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SafeIcon icon={FiSearch} className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search selectors..."
              className="pl-10 pr-3 py-2 border border-gray-300 rounded-md w-full"
            />
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SafeIcon icon={FiFilter} className="h-4 w-4 text-gray-400" />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white"
            >
              <option value="all">All Types</option>
              <option value="class">Classes</option>
              <option value="id">IDs</option>
              <option value="tag">Tags</option>
            </select>
          </div>
        </div>
      </motion.div>
      
      <div className="mt-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          {activeSection === 'used' ? 'All Used Selectors' : 'All Unused Selectors'}
          {searchQuery && <span className="text-sm font-normal ml-2">filtered by "{searchQuery}"</span>}
        </h3>
        
        {filteredSelectors.length > 0 ? (
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 overflow-auto max-h-[500px]">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Selector
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Source File
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredSelectors.map((item, index) => (
                  <tr 
                    key={index}
                    className={`hover:bg-${activeSection === 'used' ? 'green' : 'red'}-50`}
                  >
                    <td className={`px-4 py-2 font-mono text-sm ${
                      activeSection === 'used' ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {item.selector}
                    </td>
                    <td className="px-4 py-2 text-xs text-gray-500 truncate max-w-xs">
                      <div className="truncate" title={item.file}>
                        {item.file}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-8 text-center border border-gray-200">
            <p className="text-gray-500">
              {searchQuery 
                ? 'No matching selectors found' 
                : activeSection === 'used' 
                  ? 'No used selectors found' 
                  : 'No unused selectors found'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllSelectors;