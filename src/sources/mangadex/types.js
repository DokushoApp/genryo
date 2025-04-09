/**
 * MangaDex-specific types
 *
 * @typedef {Object} MangaDexManga
 * @property {string} id - MangaDex manga ID
 * @property {string} type - Entity type (manga)
 * @property {Object} attributes - Manga attributes
 * @property {Object} attributes.title - Title in different languages
 * @property {Object} attributes.altTitles - Alternative titles in different languages
 * @property {Object} attributes.description - Description in different languages
 * @property {string} attributes.originalLanguage - Original language
 * @property {string} attributes.status - Publication status
 * @property {string} attributes.contentRating - Content rating
 * @property {Object} attributes.tags - Manga tags
 * @property {string} attributes.createdAt - Creation date
 * @property {string} attributes.updatedAt - Update date
 * @property {Object} relationships - Related entities
 */

/**
 * @typedef {Object} MangaDexChapter
 * @property {string} id - MangaDex chapter ID
 * @property {string} type - Entity type (chapter)
 * @property {Object} attributes - Chapter attributes
 * @property {string} attributes.title - Chapter title
 * @property {string} attributes.volume - Volume number
 * @property {string} attributes.chapter - Chapter number
 * @property {string} attributes.translatedLanguage - Translation language
 * @property {Array<string>} attributes.data - Page file names
 * @property {string} attributes.publishAt - Publication date
 * @property {Object} relationships - Related entities
 */

/**
 * @typedef {Object} MangaDexTag
 * @property {string} id - Tag ID
 * @property {string} type - Entity type (tag)
 * @property {Object} attributes - Tag attributes
 * @property {Object} attributes.name - Tag name in different languages
 * @property {Object} attributes.description - Tag description in different languages
 * @property {string} attributes.group - Tag group
 */

// No exports needed as these are just JSDoc type definitions