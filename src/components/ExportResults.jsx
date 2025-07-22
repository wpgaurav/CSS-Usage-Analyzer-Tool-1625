import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiDownload, FiCheck, FiClipboard } = FiIcons;

const ExportResults = ({ results }) => {
  const [copied, setCopied] = useState(false);
  const [format, setFormat] = useState('full');

  // Prepare data for export
  const prepareExportData = () => {
    if (format === 'full') {
      return results;
    } else if (format === 'summary') {
      const totalSelectors = results.cssFiles.reduce((sum, file) => sum + file.totalSelectors, 0);
      const totalUsed = results.cssFiles.reduce((sum, file) => sum + file.usedSelectors.length, 0);
      const totalUnused = results.cssFiles.reduce((sum, file) => sum + file.unusedSelectors.length, 0);

      return {
        url: results.url,
        summary: {
          cssFilesCount: results.cssFiles.length,
          totalSelectors,
          usedSelectors: totalUsed,
          unusedSelectors: totalUnused,
          usagePercentage: totalSelectors > 0 ? Math.round((totalUsed / totalSelectors) * 100) : 0,
        },
        timestamp: results.timestamp,
      };
    } else if (format === 'unused-only') {
      return {
        url: results.url,
        unusedSelectors: results.cssFiles.map(file => ({
          file: file.url,
          selectors: file.unusedSelectors
        })),
        timestamp: results.timestamp,
      };
    } else if (format === 'used-only') {
      return {
        url: results.url,
        usedSelectors: results.cssFiles.map(file => ({
          file: file.url,
          selectors: file.usedSelectors
        })),
        timestamp: results.timestamp,
      };
    }
    
    return results;
  };

  const jsonData = JSON.stringify(prepareExportData(), null, 2);
  
  // Create download link
  const downloadJson = () => {
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `css-analysis-${format}-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Copy to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(jsonData).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Export Analysis Results
        </h3>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Export Format
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="format"
                    value="full"
                    checked={format === 'full'}
                    onChange={() => setFormat('full')}
                    className="h-4 w-4 text-blue-600"
                  />
                  <div>
                    <span className="block font-medium">Full Analysis</span>
                    <span className="text-xs text-gray-500">Complete data including all selectors and HTML elements</span>
                  </div>
                </label>
              </div>
              
              <div>
                <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="format"
                    value="summary"
                    checked={format === 'summary'}
                    onChange={() => setFormat('summary')}
                    className="h-4 w-4 text-blue-600"
                  />
                  <div>
                    <span className="block font-medium">Summary</span>
                    <span className="text-xs text-gray-500">Only statistics and overview data</span>
                  </div>
                </label>
              </div>
              
              <div>
                <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="format"
                    value="unused-only"
                    checked={format === 'unused-only'}
                    onChange={() => setFormat('unused-only')}
                    className="h-4 w-4 text-blue-600"
                  />
                  <div>
                    <span className="block font-medium">Unused Selectors Only</span>
                    <span className="text-xs text-gray-500">Just the unused CSS selectors</span>
                  </div>
                </label>
              </div>
              
              <div>
                <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="format"
                    value="used-only"
                    checked={format === 'used-only'}
                    onChange={() => setFormat('used-only')}
                    className="h-4 w-4 text-blue-600"
                  />
                  <div>
                    <span className="block font-medium">Used Selectors Only</span>
                    <span className="text-xs text-gray-500">Just the used CSS selectors</span>
                  </div>
                </label>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preview
            </label>
            <div className="bg-gray-50 rounded-lg p-4 max-h-80 overflow-auto">
              <pre className="text-xs text-gray-700 whitespace-pre-wrap">{jsonData}</pre>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <motion.button
              onClick={downloadJson}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
            >
              <SafeIcon icon={FiDownload} className="h-5 w-5" />
              <span>Download JSON</span>
            </motion.button>
            
            <motion.button
              onClick={copyToClipboard}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg transition-colors"
            >
              <SafeIcon icon={copied ? FiCheck : FiClipboard} className={`h-5 w-5 ${copied ? 'text-green-600' : ''}`} />
              <span>{copied ? 'Copied!' : 'Copy to Clipboard'}</span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ExportResults;