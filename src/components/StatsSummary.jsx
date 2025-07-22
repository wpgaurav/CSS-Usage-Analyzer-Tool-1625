import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiFileText, FiCode, FiTag, FiAlertTriangle, FiCheckCircle } = FiIcons;

const StatsSummary = ({ results }) => {
  const totalSelectors = results.cssFiles.reduce((sum, file) => sum + file.totalSelectors, 0);
  const totalUsed = results.cssFiles.reduce((sum, file) => sum + file.usedSelectors.length, 0);
  const totalUnused = results.cssFiles.reduce((sum, file) => sum + file.unusedSelectors.length, 0);
  const usagePercentage = totalSelectors > 0 ? Math.round((totalUsed / totalSelectors) * 100) : 0;

  const stats = [
    {
      title: 'CSS Files',
      value: results.cssFiles.length,
      icon: FiFileText,
      color: 'blue',
    },
    {
      title: 'Total Selectors',
      value: totalSelectors,
      icon: FiCode,
      color: 'purple',
    },
    {
      title: 'Used Selectors',
      value: totalUsed,
      icon: FiCheckCircle,
      color: 'green',
    },
    {
      title: 'Unused Selectors',
      value: totalUnused,
      icon: FiAlertTriangle,
      color: 'red',
    },
    {
      title: 'HTML Classes',
      value: results.htmlElements.classes.length,
      icon: FiTag,
      color: 'indigo',
    },
    {
      title: 'HTML IDs',
      value: results.htmlElements.ids.length,
      icon: FiTag,
      color: 'pink',
    },
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-800',
      purple: 'bg-purple-100 text-purple-800',
      green: 'bg-green-100 text-green-800',
      red: 'bg-red-100 text-red-800',
      indigo: 'bg-indigo-100 text-indigo-800',
      pink: 'bg-pink-100 text-pink-800',
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="space-y-6">
      {/* Overall Usage */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          CSS Usage Overview
        </h3>
        <div className="inline-flex items-center space-x-4">
          <div className="text-3xl font-bold text-green-600">{usagePercentage}%</div>
          <div className="text-gray-600">of CSS selectors are being used</div>
        </div>
        
        <div className="mt-4 max-w-md mx-auto">
          <div className="w-full bg-gray-200 rounded-full h-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${usagePercentage}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full"
            />
          </div>
          <div className="flex justify-between text-sm text-gray-600 mt-1">
            <span>{totalUsed} used</span>
            <span>{totalUnused} unused</span>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white border border-gray-200 rounded-lg p-4 text-center hover:shadow-md transition-shadow duration-200"
          >
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-3 ${getColorClasses(stat.color)}`}>
              <SafeIcon icon={stat.icon} className="h-6 w-6" />
            </div>
            <div className="text-2xl font-bold text-gray-800 mb-1">
              {stat.value.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">{stat.title}</div>
          </motion.div>
        ))}
      </div>

      {/* Recommendations */}
      {totalUnused > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-yellow-50 border border-yellow-200 rounded-lg p-4"
        >
          <div className="flex items-start space-x-3">
            <SafeIcon icon={FiAlertTriangle} className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-800 mb-1">
                Optimization Opportunity
              </h4>
              <p className="text-yellow-700 text-sm">
                You have {totalUnused} unused CSS selectors. Removing them could reduce your CSS file size 
                and improve page load performance.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {usagePercentage >= 90 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-green-50 border border-green-200 rounded-lg p-4"
        >
          <div className="flex items-start space-x-3">
            <SafeIcon icon={FiCheckCircle} className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-green-800 mb-1">
                Excellent CSS Optimization!
              </h4>
              <p className="text-green-700 text-sm">
                Your CSS usage is very efficient with {usagePercentage}% of selectors being used.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default StatsSummary;