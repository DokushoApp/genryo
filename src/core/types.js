/**
 * @typedef {Object} Manga
 * @property {string} id - Unique identifier for the manga
 * @property {string} title - Primary title of the manga
 * @property {Array<string>} altTitles - Alternative titles
 * @property {string} description - Manga description
 * @property {Array<string>} authors - List of authors
 * @property {Array<string>} artists - List of artists
 * @property {Array<string>} genres - List of genres
 * @property {Array<Object>} tags - List of tag objects
 * @property {string} status - Publication status (ongoing, completed, hiatus, cancelled)
 * @property {string} cover - URL of the primary cover image
 * @property {Array<string>} covers - URLs of all cover images
 * @property {Array<Chapter>} chapters - List of chapters
 * @property {string} lastUpdated - Last update date in ISO format
 * @property {number} rating - Manga rating (0-10)
 * @property {number} views - Number of views
 * @property {string} source - Source name
 * @property {string} sourceId - Original ID from the source
 */

/**
 * @typedef {Object} Chapter
 * @property {string} id - Unique identifier for the chapter
 * @property {string} mangaId - ID of the manga this chapter belongs to
 * @property {string} title - Chapter title
 * @property {number} chapterNumber - Chapter number
 * @property {number|null} volume - Volume number
 * @property {string} language - Language code
 * @property {number} pages - Number of pages
 * @property {string} published - Publication date in ISO format
 * @property {string|null} group - Scanlation group
 * @property {string} source - Source name
 * @property {string} sourceId - Original ID from the source
 */

/**
 * @typedef {Object} Page
 * @property {string} url - URL of the page image
 * @property {number} index - Page number
 * @property {string|null} chapterId - ID of the chapter this page belongs to
 */

/**
 * @typedef {Object} SearchOptions
 * @property {number} page - Page number
 * @property {number} limit - Results per page
 * @property {Object} filters - Filter criteria
 * @property {Array<string>} genres - Genres to include
 * @property {Array<string>} excludedGenres - Genres to exclude
 * @property {string} status - Publication status
 * @property {string} sort - Sort criteria
 * @property {string} order - Sort order (asc/desc)
 */

/**
 * @typedef {Object} Genre
 * @property {string} id - Genre ID
 * @property {string} name - Genre name
 */

/**
 * @typedef {Object} ExtensionInfo
 * @property {string} name - Extension name
 * @property {string} version - Extension version
 * @property {string} icon - Extension icon
 * @property {Array<string>} lang - Supported languages
 */

// No exports needed as these are just JSDoc type definitions