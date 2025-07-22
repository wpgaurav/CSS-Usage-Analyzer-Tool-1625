import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiSearch, FiGlobe } = FiIcons;

const URLInput = ({ onAnalyze, isAnalyzing }) => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url.trim() && !isAnalyzing) {
      let formattedUrl = url.trim();
      if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
        formattedUrl = 'https://' + formattedUrl;
      }
      onAnalyze(formattedUrl);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6 mb-8"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SafeIcon icon={FiGlobe} className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter website URL (e.g., example.com or https://example.com)"
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
            disabled={isAnalyzing}
          />
        </div>
        
        <motion.button
          type="submit"
          disabled={!url.trim() || isAnalyzing}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2"
        >
          <SafeIcon icon={FiSearch} className="h-5 w-5" />
          <span>{isAnalyzing ? 'Analyzing...' : 'Analyze CSS'}</span>
        </motion.button>
      </form>
      
      <div className="mt-4 text-sm text-gray-600">
        <p className="font-medium mb-2">How it works:</p>
        <ul className="space-y-1 text-gray-500">
          <li>• Fetches the webpage and all linked CSS files</li>
          <li>• Extracts all CSS classes and IDs from stylesheets</li>
          <li>• Scans HTML content for used classes and IDs</li>
          <li>• Identifies unused CSS for optimization</li>
        </ul>
      </div>
    </motion.div>
  );
};

export default URLInput;