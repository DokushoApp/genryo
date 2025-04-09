/**
 * Public API for Dokusho Extensions
 * This module provides a unified interface for interacting with manga sources
 */

class DokushoAPI {
  constructor() {
    this.extensions = {};
    this.activeExtensions = [];
    this.proxyUrl = null;
  }

  /**
   * Register an extension with the API
   * @param {Extension} extension - Extension instance
   */
  registerExtension(extension) {
    if (!extension || !extension.name) {
      console.error('Invalid extension provided');
      return;
    }

    this.extensions[extension.name] = extension;
    if (extension.isActive) {
      this.activeExtensions.push(extension.name);
    }
  }

  /**
   * Get a list of all registered extensions
   * @returns {Array} - Array of extension info objects
   */
  getExtensions() {
    return Object.values(this.extensions).map(ext => ext.getInfo());
  }

  /**
   * Get an extension by name
   * @param {string} name - Extension name
   * @returns {Extension|null} - Extension instance or null if not found
   */
  getExtension(name) {
    return this.extensions[name] || null;
  }

  /**
   * Set the active state of an extension
   * @param {string} name - Extension name
   * @param {boolean} active - Active state
   * @returns {boolean} - New active state
   */
  setExtensionActive(name, active) {
    const extension = this.extensions[name];
    if (!extension) {
      console.error(`Extension '${name}' not found`);
      return false;
    }

    const newState = extension.setActive(active);

    // Update active extensions list
    if (newState) {
      if (!this.activeExtensions.includes(name)) {
        this.activeExtensions.push(name);
      }
    } else {
      const index = this.activeExtensions.indexOf(name);
      if (index !== -1) {
        this.activeExtensions.splice(index, 1);
      }
    }

    return newState;
  }

  /**
   * Get a list of active extensions
   * @returns {Array} - Array of active extension info objects
   */
  getActiveExtensions() {
    return this.activeExtensions.map(name => this.extensions[name].getInfo());
  }

  /**
   * Set a proxy URL for CORS issues
   * @param {string} url - Proxy URL
   */
  setProxyUrl(url) {
    this.proxyUrl = url;
  }

  /**
   * Get all manga from all active sources or a specific source
   * @param {Object} options - Search options
   * @param {string} [options.source] - Source name (optional)
   * @returns {Promise<Array>} - Array of manga objects
   */
  async getAllManga(options = {}) {
    if (options.source) {
      const extension = this.extensions[options.source];
      if (!extension || !extension.isActive) {
        console.error(`Extension '${options.source}' not found or not active`);
        return [];
      }
      return extension.getAllManga(options);
    }

    const results = [];
    const activeExtensions = this.activeExtensions.map(name => this.extensions[name]);

    await Promise.all(
      activeExtensions.map(async (extension) => {
        try {
          const manga = await extension.getAllManga(options);
          results.push(...manga);
        } catch (error) {
          console.error(`Error fetching manga from ${extension.name}:`, error);
        }
      })
    );

    return results;
  }

  /**
   * Get a specific manga by ID from a specific source
   * @param {string} source - Source name
   * @param {string} id - Manga ID
   * @returns {Promise<Object|null>} - Manga object or null if not found
   */
  async getManga(source, id) {
    const extension = this.extensions[source];
    if (!extension) {
      console.error(`Extension '${source}' not found`);
      return null;
    }

    try {
      return await extension.getManga(id);
    } catch (error) {
      console.error(`Error fetching manga ${id} from ${source}:`, error);
      return null;
    }
  }

  /**
   * Get chapters for a manga from a specific source
   * @param {string} source - Source name
   * @param {string} mangaId - Manga ID
   * @param {Object} options - Filter options
   * @returns {Promise<Array>} - Array of chapter objects
   */
  async getChapters(source, mangaId, options = {}) {
    const extension = this.extensions[source];
    if (!extension) {
      console.error(`Extension '${source}' not found`);
      return [];
    }

    try {
      return await extension.getChapters(mangaId, options);
    } catch (error) {
      console.error(`Error fetching chapters for manga ${mangaId} from ${source}:`, error);
      return [];
    }
  }

  /**
   * Get pages for a chapter from a specific source
   * @param {string} source - Source name
   * @param {string} chapterId - Chapter ID
   * @returns {Promise<Array>} - Array of page URLs
   */
  async getPages(source, chapterId) {
    const extension = this.extensions[source];
    if (!extension) {
      console.error(`Extension '${source}' not found`);
      return [];
    }

    try {
      return await extension.getPages(chapterId);
    } catch (error) {
      console.error(`Error fetching pages for chapter ${chapterId} from ${source}:`, error);
      return [];
    }
  }

  /**
   * Search for manga across all active sources or a specific source
   * @param {string} query - Search term
   * @param {Object} options - Search options
   * @param {string} [options.source] - Source name (optional)
   * @returns {Promise<Array>} - Array of manga objects
   */
  async search(query, options = {}) {
    if (options.source) {
      const extension = this.extensions[options.source];
      if (!extension || !extension.isActive) {
        console.error(`Extension '${options.source}' not found or not active`);
        return [];
      }
      return extension.search(query, options);
    }

    const results = [];
    const activeExtensions = this.activeExtensions.map(name => this.extensions[name]);

    await Promise.all(
      activeExtensions.map(async (extension) => {
        try {
          const manga = await extension.search(query, options);
          results.push(...manga);
        } catch (error) {
          console.error(`Error searching manga from ${extension.name}:`, error);
        }
      })
    );

    return results;
  }

  /**
   * Get genres/tags from a specific source
   * @param {string} source - Source name
   * @returns {Promise<Array>} - Array of genre/tag objects
   */
  async getGenres(source) {
    const extension = this.extensions[source];
    if (!extension) {
      console.error(`Extension '${source}' not found`);
      return [];
    }

    try {
      return await extension.getGenres();
    } catch (error) {
      console.error(`Error fetching genres from ${source}:`, error);
      return [];
    }
  }

  /**
   * Get all genres/tags from all active sources
   * @returns {Promise<Object>} - Object with source names as keys and arrays of genre/tag objects as values
   */
  async getAllGenres() {
    const results = {};
    const activeExtensions = this.activeExtensions.map(name => this.extensions[name]);

    await Promise.all(
      activeExtensions.map(async (extension) => {
        try {
          const genres = await extension.getGenres();
          results[extension.name] = genres;
        } catch (error) {
          console.error(`Error fetching genres from ${extension.name}:`, error);
          results[extension.name] = [];
        }
      })
    );

    return results;
  }
}

// Create and export a singleton instance
const api = new DokushoAPI();
export default api;