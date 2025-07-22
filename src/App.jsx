import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from './components/Header';
import URLInput from './components/URLInput';
import AnalysisResults from './components/AnalysisResults';
import LoadingSpinner from './components/LoadingSpinner';
import Footer from './components/Footer';
import { analyzeCSSUsage } from './utils/cssAnalyzer';

function App() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleAnalyze = async (url) => {
    setIsAnalyzing(true);
    setError(null);
    setResults(null);

    try {
      const analysisResults = await analyzeCSSUsage(url);
      setResults(analysisResults);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            CSS Analyzer Tool
          </h1>
          <p className="text-lg text-gray-600">
            Analyze websites to find used and unused CSS classes
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <URLInput onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
          {isAnalyzing && <LoadingSpinner />}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg"
            >
              <p className="text-red-700 font-medium">Error: {error}</p>
            </motion.div>
          )}
          {results && <AnalysisResults results={results} />}
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}

export default App;