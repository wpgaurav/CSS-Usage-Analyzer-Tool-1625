import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiCode, FiGithub } = FiIcons;

const Header = () => {
  return (
    <header className="bg-white border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <SafeIcon icon={FiCode} className="h-6 w-6 text-gray-700" />
            <span className="font-semibold text-gray-800 text-lg">CSS Analyzer</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <a 
              href="https://github.com/wpgaurav" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 flex items-center space-x-1"
            >
              <SafeIcon icon={FiGithub} className="h-5 w-5" />
              <span>GitHub</span>
            </a>
            <a 
              href="https://gauravtiwari.org/about/" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900"
            >
              About
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;