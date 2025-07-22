import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiChevronDown, FiChevronRight, FiExternalLink, FiCheck, FiX } = FiIcons;

const CSSFileAnalysis = ({ cssFile }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState('unused');

  const usagePercentage = cssFile.totalSelectors > 0 
    ? Math.round((cssFile.usedSelectors.length / cssFile.totalSelectors) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="border border-gray-200 rounded-lg overflow-hidden"
    >
      <div
        className="p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors duration-200"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <SafeIcon 
              icon={isExpanded ? FiChevronDown : FiChevronRight} 
              className="h-4 w-4 text-gray-500" 
            />
            <div>
              <h3 className="font-medium text-gray-800">{cssFile.url}</h3>
              <p className="text-sm text-gray-600">
                {cssFile.usedSelectors.length} used / {cssFile.totalSelectors} total 
                ({usagePercentage}% usage)
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm font-medium text-red-600">
                {cssFile.unusedSelectors.length} unused
              </div>
              <div className="text-xs text-gray-500">
                {Math.round((cssFile.size || 0) / 1024)}KB
              </div>
            </div>
            <a
              href={cssFile.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800"
              onClick={(e) => e.stopPropagation()}
            >
              <SafeIcon icon={FiExternalLink} className="h-4 w-4" />
            </a>
          </div>
        </div>
        
        {/* Usage Bar */}
        <div className="mt-3">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${usagePercentage}%` }}
            />
          </div>
        </div>
      </div>

      {isExpanded && (
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: 'auto' }}
          exit={{ height: 0 }}
          className="border-t border-gray-200"
        >
          <div className="p-4">
            {/* Section Tabs */}
            <div className="flex space-x-4 mb-4">
              <button
                onClick={() => setActiveSection('unused')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${
                  activeSection === 'unused'
                    ? 'bg-red-100 text-red-800'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <div className="flex items-center space-x-1">
                  <SafeIcon icon={FiX} className="h-3 w-3" />
                  <span>Unused ({cssFile.unusedSelectors.length})</span>
                </div>
              </button>
              <button
                onClick={() => setActiveSection('used')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${
                  activeSection === 'used'
                    ? 'bg-green-100 text-green-800'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <div className="flex items-center space-x-1">
                  <SafeIcon icon={FiCheck} className="h-3 w-3" />
                  <span>Used ({cssFile.usedSelectors.length})</span>
                </div>
              </button>
            </div>

            {/* Selectors List */}
            <div className="max-h-64 overflow-y-auto">
              {activeSection === 'unused' && (
                <div className="space-y-1">
                  {cssFile.unusedSelectors.length > 0 ? (
                    cssFile.unusedSelectors.map((selector, index) => (
                      <div
                        key={index}
                        className="bg-red-50 border border-red-200 rounded px-3 py-2 text-sm font-mono text-red-800"
                      >
                        {selector}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm italic">
                      All selectors are being used!
                    </p>
                  )}
                </div>
              )}

              {activeSection === 'used' && (
                <div className="space-y-1">
                  {cssFile.usedSelectors.length > 0 ? (
                    cssFile.usedSelectors.map((selector, index) => (
                      <div
                        key={index}
                        className="bg-green-50 border border-green-200 rounded px-3 py-2 text-sm font-mono text-green-800"
                      >
                        {selector}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm italic">
                      No selectors are being used.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default CSSFileAnalysis;