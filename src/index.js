/**
 * Dokusho Extensions - Main entry point
 * This file exports all extension functionality and sources
 */

import * as sources from './sources';
import Extension from './core/extension';
import utils from './core/utils';
import api from './api';

// Create an instance of each source
const instances = {};
Object.keys(sources).forEach(key => {
  const Source = sources[key];
  instances[key] = new Source();
});

/**
 * Get all available sources
 * @returns {Object} - Object with source instances
 */
const getAllSources = () => {
  return { ...instances };
};

/**
 * Get a specific source by name
 * @param {string} name - Source name
 * @returns {Extension|null} - Source instance or null if not found
 */
const getSource = (name) => {
  return instances[name] || null;
};

/**
 * Get all manga from all active sources
 * @param {Object} options - Search options
 * @returns {Promise<Array>} - Array of manga objects from all sources
 */
const getAllManga = async (options = {}) => {
  const results = [];
  const activeSources = Object.values(instances).filter(source => source.isActive);

  await Promise.all(
    activeSources.map(async (source) => {
      try {
        const manga = await source.getAllManga(options);
        results.push(...manga);
      } catch (error) {
        console.error(`Error fetching manga from ${source.name}:`, error);
      }
    })
  );

  return results;
};

/**
 * Search for manga across all active sources
 * @param {string} query - Search term
 * @param {Object} options - Search options
 * @returns {Promise<Array>} - Array of manga objects from all sources
 */
const searchAll = async (query, options = {}) => {
  const results = [];
  const activeSources = Object.values(instances).filter(source => source.isActive);

  await Promise.all(
    activeSources.map(async (source) => {
      try {
        const manga = await source.search(query, options);
        results.push(...manga);
      } catch (error) {
        console.error(`Error searching manga from ${source.name}:`, error);
      }
    })
  );

  return results;
};

// Register extensions with the API
Object.values(instances).forEach(instance => {
  api.registerExtension(instance);
});

// Export all functionality
export {
  Extension,
  utils,
  sources,
  getAllSources,
  getSource,
  getAllManga,
  searchAll,
  api as default
};