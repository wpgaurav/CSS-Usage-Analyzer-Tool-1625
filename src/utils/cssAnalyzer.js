import axios from 'axios';

// CORS proxy for development - replace with your own proxy in production
const CORS_PROXY = 'https://api.allorigins.win/get?url=';

export const analyzeCSSUsage = async (url) => {
  try {
    // Fetch the main HTML page
    const htmlResponse = await fetchWithCORS(url);
    const htmlContent = htmlResponse.data.contents;

    // Parse HTML to extract CSS file URLs
    const cssUrls = extractCSSUrls(htmlContent, url);

    // Extract HTML elements (classes, IDs, tags)
    const htmlElements = extractHtmlElements(htmlContent);

    // Extract inline CSS from the HTML
    const inlineCSS = extractInlineCSS(htmlContent);

    // Fetch and analyze each CSS file
    const cssFiles = await Promise.all(
      cssUrls.map(async (cssUrl) => {
        try {
          const cssResponse = await fetchWithCORS(cssUrl);
          const cssContent = cssResponse.data.contents;
          return analyzeCSSFile(cssUrl, cssContent, htmlElements);
        } catch (error) {
          console.warn(`Failed to fetch CSS file: ${cssUrl}`, error);
          return {
            url: cssUrl,
            error: error.message,
            totalSelectors: 0,
            usedSelectors: [],
            unusedSelectors: [],
            size: 0
          };
        }
      })
    );

    // Analyze inline CSS if present
    if (inlineCSS.length > 0) {
      const inlineCSSAnalysis = analyzeCSSFile('Inline CSS', inlineCSS.join('\n'), htmlElements);
      cssFiles.push(inlineCSSAnalysis);
    }

    return {
      url,
      cssFiles: cssFiles.filter(file => !file.error),
      htmlElements,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    throw new Error(`Failed to analyze CSS usage: ${error.message}`);
  }
};

const fetchWithCORS = async (url) => {
  try {
    return await axios.get(`${CORS_PROXY}${encodeURIComponent(url)}`);
  } catch (error) {
    throw new Error(`Failed to fetch ${url}: ${error.message}`);
  }
};

const extractCSSUrls = (htmlContent, baseUrl) => {
  const cssUrls = [];
  const linkRegex = /<link[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*>/gi;
  const styleRegex = /@import\s+url\(["']?([^"')]+)["']?\);?/gi;
  let match;

  // Extract from <link> tags
  while ((match = linkRegex.exec(htmlContent)) !== null) {
    const href = match[1];
    cssUrls.push(resolveUrl(href, baseUrl));
  }

  // Extract from @import statements in <style> tags
  const styleTagRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
  let styleMatch;
  while ((styleMatch = styleTagRegex.exec(htmlContent)) !== null) {
    const styleContent = styleMatch[1];
    while ((match = styleRegex.exec(styleContent)) !== null) {
      const href = match[1];
      cssUrls.push(resolveUrl(href, baseUrl));
    }
  }

  return [...new Set(cssUrls)]; // Remove duplicates
};

const extractInlineCSS = (htmlContent) => {
  const inlineCSS = [];
  
  // Extract from <style> tags
  const styleTagRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
  let match;
  
  while ((match = styleTagRegex.exec(htmlContent)) !== null) {
    const styleContent = match[1].trim();
    if (styleContent) {
      // Remove @import statements as they're handled separately
      const cleanedContent = styleContent.replace(/@import\s+url\([^)]+\);?/gi, '');
      if (cleanedContent.trim()) {
        inlineCSS.push(cleanedContent);
      }
    }
  }
  
  return inlineCSS;
};

const resolveUrl = (href, baseUrl) => {
  if (href.startsWith('http://') || href.startsWith('https://')) {
    return href;
  }
  
  const base = new URL(baseUrl);
  if (href.startsWith('//')) {
    return `${base.protocol}${href}`;
  }
  if (href.startsWith('/')) {
    return `${base.protocol}//${base.host}${href}`;
  }
  
  return new URL(href, baseUrl).href;
};

const extractHtmlElements = (htmlContent) => {
  const classes = new Set();
  const ids = new Set();
  const tags = new Set();

  // Remove script and style content to avoid false positives
  const cleanedHtml = htmlContent
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '');

  // Extract classes
  const classRegex = /class=["']([^"']+)["']/gi;
  let match;
  while ((match = classRegex.exec(cleanedHtml)) !== null) {
    const classNames = match[1].split(/\s+/).filter(name => name.trim());
    classNames.forEach(className => {
      if (className && !className.includes('{{') && !className.includes('{%')) {
        classes.add(className.trim());
      }
    });
  }

  // Extract IDs
  const idRegex = /id=["']([^"']+)["']/gi;
  while ((match = idRegex.exec(cleanedHtml)) !== null) {
    const id = match[1].trim();
    if (id && !id.includes('{{') && !id.includes('{%')) {
      ids.add(id);
    }
  }

  // Extract HTML tags
  const tagRegex = /<(\w+)(?:\s|>)/gi;
  while ((match = tagRegex.exec(cleanedHtml)) !== null) {
    const tag = match[1].toLowerCase();
    if (tag) {
      tags.add(tag);
    }
  }

  return {
    classes: Array.from(classes).sort(),
    ids: Array.from(ids).sort(),
    tags: Array.from(tags).sort()
  };
};

const analyzeCSSFile = (url, cssContent, htmlElements) => {
  const selectors = extractCSSSelectors(cssContent);
  const usedSelectors = [];
  const unusedSelectors = [];

  selectors.forEach(selector => {
    if (isSelectorUsed(selector, htmlElements)) {
      usedSelectors.push(selector);
    } else {
      unusedSelectors.push(selector);
    }
  });

  return {
    url,
    totalSelectors: selectors.length,
    usedSelectors,
    unusedSelectors,
    size: new Blob([cssContent]).size
  };
};

const extractCSSSelectors = (cssContent) => {
  const selectors = [];

  // Remove comments and minify
  const cleanedCSS = cssContent
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .trim();

  // Split by { to get selectors
  const rules = cleanedCSS.split('{');
  
  rules.forEach(rule => {
    const selectorPart = rule.split('}').pop();
    if (selectorPart && selectorPart.trim()) {
      // Split multiple selectors separated by commas
      const individualSelectors = selectorPart.split(',');
      individualSelectors.forEach(selector => {
        const trimmedSelector = selector.trim();
        if (trimmedSelector && 
            !trimmedSelector.startsWith('@') && 
            !trimmedSelector.includes('keyframes') &&
            trimmedSelector.length > 0) {
          selectors.push(trimmedSelector);
        }
      });
    }
  });

  return [...new Set(selectors)].sort();
};

const isSelectorUsed = (selector, htmlElements) => {
  // Simplify complex selectors for basic matching
  const simplifiedSelector = simplifySelector(selector);

  // Check for class selectors (.class-name)
  if (simplifiedSelector.startsWith('.')) {
    const className = simplifiedSelector.substring(1).split(/[\s>+~:]/)[0];
    return htmlElements.classes.includes(className);
  }

  // Check for ID selectors (#id-name)
  if (simplifiedSelector.startsWith('#')) {
    const idName = simplifiedSelector.substring(1).split(/[\s>+~:]/)[0];
    return htmlElements.ids.includes(idName);
  }

  // Check for tag selectors
  const tagMatch = simplifiedSelector.match(/^([a-zA-Z][a-zA-Z0-9]*)/);
  if (tagMatch) {
    const tagName = tagMatch[1].toLowerCase();
    return htmlElements.tags.includes(tagName);
  }

  // Check for attribute selectors, pseudo-classes, etc.
  // For complex selectors, we'll assume they might be used
  if (simplifiedSelector.includes('[') || 
      simplifiedSelector.includes(':') || 
      simplifiedSelector.includes('*')) {
    return true;
  }

  return false;
};

const simplifySelector = (selector) => {
  // Remove pseudo-elements and some pseudo-classes for basic matching
  return selector
    .replace(/::?[a-zA-Z-]+(\([^)]*\))?/g, '')
    .replace(/\[[^\]]*\]/g, '')
    .trim();
};