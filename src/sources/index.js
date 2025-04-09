/**
 * Import and export all source extensions
 * This file serves as a registry for all available sources
 */

// Import all source extensions
import MangaDex from './mangadex';
// import MangaKakalot from './mangakakalot';
// Import additional sources as they are implemented
// import Manganato from './manganato';
// import MangaPlus from './mangaplus';
// import AsuraScans from './asurascans';
// import ReaperScans from './reaperscans';

// Export all sources
export {
  MangaDex,
  // MangaKakalot,
  // Manganato,
  // MangaPlus,
  // AsuraScans,
  // ReaperScans,
};

/**
 * Get source class by name
 * @param {string} name - Source name
 * @returns {Function|null} - Source class or null if not found
 */
export const getSourceByName = (name) => {
  const sources = {
    MangaDex,
    MangaKakalot,
    // Manganato,
    // MangaPlus,
    // AsuraScans,
    // ReaperScans,
  };

  return sources[name] || null;
};

/**
 * Get all available source names
 * @returns {Array<string>} - Array of source names
 */
export const getAllSourceNames = () => {
  return [
    'MangaDex',
    'MangaKakalot',
    // 'Manganato',
    // 'MangaPlus',
    // 'AsuraScans',
    // 'ReaperScans',
  ];
};

// Export default as an object with all sources
export default {
  MangaDex,
  // MangaKakalot,
  // Manganato,
  // MangaPlus,
  // AsuraScans,
  // ReaperScans,
  getSourceByName,
  getAllSourceNames,
};