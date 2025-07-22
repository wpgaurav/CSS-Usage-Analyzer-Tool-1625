import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import CSSFileAnalysis from './CSSFileAnalysis';
import StatsSummary from './StatsSummary';
import AllSelectors from './AllSelectors';
import ExportResults from './ExportResults';

const { FiFileText, FiCode, FiTag, FiList, FiDownload } = FiIcons;

const AnalysisResults = ({ results }) => {
  const [activeTab, setActiveTab] = useState('summary');

  const tabs = [
    { id: 'summary', label: 'Summary', icon: FiFileText },
    { id: 'all-selectors', label: 'All Selectors', icon: FiList },
    { id: 'css-files', label: 'CSS Files', icon: FiCode },
    { id: 'html-elements', label: 'HTML Elements', icon: FiTag },
    { id: 'export', label: 'Export', icon: FiDownload },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden"
    >
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 overflow-x-auto">
        <nav className="flex space-x-6 px-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors duration-200 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <SafeIcon icon={tab.icon} className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'summary' && <StatsSummary results={results} />}
        
        {activeTab === 'all-selectors' && <AllSelectors results={results} />}
        
        {activeTab === 'css-files' && (
          <div className="space-y-6">
            {results.cssFiles.map((cssFile, index) => (
              <CSSFileAnalysis key={index} cssFile={cssFile} />
            ))}
          </div>
        )}
        
        {activeTab === 'html-elements' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                HTML Elements Found
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">
                    Classes ({results.htmlElements.classes.length})
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
                    {results.htmlElements.classes.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {results.htmlElements.classes.map((className, index) => (
                          <span
                            key={index}
                            className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                          >
                            .{className}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">No classes found</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">
                    IDs ({results.htmlElements.ids.length})
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
                    {results.htmlElements.ids.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {results.htmlElements.ids.map((id, index) => (
                          <span
                            key={index}
                            className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded"
                          >
                            #{id}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">No IDs found</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-700 mb-2">
                HTML Tags ({results.htmlElements.tags.length})
              </h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex flex-wrap gap-1">
                  {results.htmlElements.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'export' && <ExportResults results={results} />}
      </div>
    </motion.div>
  );
};

export default AnalysisResults;