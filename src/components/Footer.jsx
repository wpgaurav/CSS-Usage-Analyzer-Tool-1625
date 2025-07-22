import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="mt-12 pb-8">
      <nav className="text-center text-gray-600 text-sm">
        © 2008-{currentYear}: <a 
          href="https://gauravtiwari.org" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 transition-colors"
        >
          Gaurav Tiwari
        </a> | <a 
          href="https://gauravtiwari.org/contact/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 transition-colors"
        >
          Contact
        </a> | <a 
          href="https://gauravtiwari.org/privacy-policy/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 transition-colors"
        >
          Privacy Policy
        </a>
      </nav>
    </footer>
  );
};

export default Footer;