import axios from 'axios';

/**
 * Fetch data from a URL
 * @param {string} url - URL to fetch
 * @param {Object} options - Fetch options
 * @returns {Promise<Object>} - Response data
 */
const fetchData = async (url, options = {}) => {
  try {
    const response = await axios({
      url,
      method: options.method || 'GET',
      headers: options.headers || {},
      data: options.data || null,
      params: options.params || null,
      timeout: options.timeout || 30000,
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    throw error;
  }
};

/**
 * Format date to a standard format
 * @param {string|Date} date - Date to format
 * @returns {string} - Formatted date
 */
const formatDate = (date) => {
  if (!date) return null;
  const d = new Date(date);
  if (isNaN(d.getTime())) return null;
  return d.toISOString();
};

/**
 * Create a standardized manga object
 * @param {Object} manga - Source manga object
 * @param {Object} mapping - Field mapping from source to standard
 * @returns {Object} - Standardized manga object
 */
const normalizeManga = (manga, mapping) => {
  const normalized = {
    id: null,
    title: null,
    altTitles: [],
    description: null,
    authors: [],
    artists: [],
    genres: [],
    tags: [],
    status: 'unknown',
    cover: null,
    covers: [],
    chapters: [],
    lastUpdated: null,
    rating: null,
    views: 0,
    source: null,
    sourceId: null,
  };

  // Apply mapping
  Object.keys(mapping).forEach(key => {
    const sourceKey = mapping[key];
    if (typeof sourceKey === 'function') {
      normalized[key] = sourceKey(manga);
    } else if (manga[sourceKey] !== undefined) {
      normalized[key] = manga[sourceKey];
    }
  });

  return normalized;
};

/**
 * Create a standardized chapter object
 * @param {Object} chapter - Source chapter object
 * @param {Object} mapping - Field mapping from source to standard
 * @returns {Object} - Standardized chapter object
 */
const normalizeChapter = (chapter, mapping) => {
  const normalized = {
    id: null,
    mangaId: null,
    title: null,
    chapterNumber: null,
    volume: null,
    language: 'en',
    pages: 0,
    published: null,
    group: null,
    source: null,
    sourceId: null,
  };

  // Apply mapping
  Object.keys(mapping).forEach(key => {
    const sourceKey = mapping[key];
    if (typeof sourceKey === 'function') {
      normalized[key] = sourceKey(chapter);
    } else if (chapter[sourceKey] !== undefined) {
      normalized[key] = chapter[sourceKey];
    }
  });

  return normalized;
};

/**
 * Create a proxy URL for CORS issues
 * @param {string} url - Original URL
 * @param {string} proxyUrl - Proxy server URL
 * @returns {string} - Proxied URL
 */
const createProxyUrl = (url, proxyUrl) => {
  if (!proxyUrl) return url;
  return `${proxyUrl}${encodeURIComponent(url)}`;
};

/**
 * Extract query parameters from a URL
 * @param {string} url - URL to parse
 * @returns {Object} - Query parameters
 */
const extractQueryParams = (url) => {
  try {
    const parsedUrl = new URL(url);
    const params = {};
    parsedUrl.searchParams.forEach((value, key) => {
      params[key] = value;
    });
    return params;
  } catch (error) {
    console.error('Error parsing URL:', error);
    return {};
  }
};

// Export all functions individually
export {
  fetchData,
  formatDate,
  normalizeManga,
  normalizeChapter,
  createProxyUrl,
  extractQueryParams
};

// Also export as default object
export default {
  fetchData,
  formatDate,
  normalizeManga,
  normalizeChapter,
  createProxyUrl,
  extractQueryParams
};