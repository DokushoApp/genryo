/**
 * Base Extension class that all source extensions must extend
 */
class Extension {
  /**
   * @param {Object} options - Extension configuration
   * @param {string} options.name - Name of the extension/source
   * @param {string} options.baseUrl - Base URL for API requests
   * @param {string} options.version - Version of the extension
   * @param {string} options.icon - URL or base64 of the icon
   */
  constructor(options = {}) {
    this.name = options.name || 'Unknown Extension';
    this.baseUrl = options.baseUrl || '';
    this.version = options.version || '1.0.0';
    this.icon = options.icon || null;
    this.lang = options.lang || ['en'];
    this.isActive = true;
  }

  /**
   * Gets all manga from the source
   * @param {Object} options - Search options
   * @param {number} options.page - Page number
   * @param {number} options.limit - Results per page
   * @param {Object} options.filters - Search filters
   * @returns {Promise<Array>} - Array of manga objects
   */
  async getAllManga(options = {}) {
    throw new Error('getAllManga not implemented');
  }

  /**
   * Gets a specific manga by ID
   * @param {string} id - Manga ID
   * @returns {Promise<Object>} - Manga object
   */
  async getManga(id) {
    throw new Error('getManga not implemented');
  }

  /**
   * Gets chapters for a manga
   * @param {string} mangaId - Manga ID
   * @param {Object} options - Filter options
   * @returns {Promise<Array>} - Array of chapter objects
   */
  async getChapters(mangaId, options = {}) {
    throw new Error('getChapters not implemented');
  }

  /**
   * Gets pages for a chapter
   * @param {string} chapterId - Chapter ID
   * @returns {Promise<Array>} - Array of page URLs
   */
  async getPages(chapterId) {
    throw new Error('getPages not implemented');
  }

  /**
   * Search for manga
   * @param {string} query - Search term
   * @param {Object} options - Search options
   * @returns {Promise<Array>} - Array of manga objects
   */
  async search(query, options = {}) {
    throw new Error('search not implemented');
  }

  /**
   * Get available genres/tags
   * @returns {Promise<Array>} - Array of genre/tag objects
   */
  async getGenres() {
    throw new Error('getGenres not implemented');
  }

  /**
   * Get extension information
   * @returns {Object} - Extension metadata
   */
  getInfo() {
    return {
      name: this.name,
      version: this.version,
      icon: this.icon,
      lang: this.lang
    };
  }

  /**
   * Toggle extension active state
   * @param {boolean} state - Active state
   */
  setActive(state) {
    this.isActive = !!state;
    return this.isActive;
  }
}

export default Extension;