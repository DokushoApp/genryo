import Extension from '../../core/extension';
import { fetchData, formatDate, normalizeManga, normalizeChapter } from '../../core/utils';

/**
 * MangaDex extension implementation
 */
class MangaDex extends Extension {
  constructor() {
    super({
      name: 'MangaDex',
      baseUrl: 'https://api.mangadex.org',
      version: '1.0.0',
      icon: 'https://mangadex.org/favicon.ico',
      lang: ['en', 'ja', 'ko', 'zh', 'fr', 'de', 'es', 'pt', 'ru', 'it'],
    });

    // Field mapping for normalization
    this.mangaMapping = {
      id: 'id',
      title: manga => this.extractTitle(manga),
      altTitles: manga => this.extractAltTitles(manga),
      description: manga => this.extractDescription(manga),
      authors: manga => this.extractCreators(manga, 'author'),
      artists: manga => this.extractCreators(manga, 'artist'),
      genres: manga => this.extractGenres(manga),
      tags: manga => this.extractTags(manga),
      status: manga => manga.attributes?.status || 'unknown',
      cover: manga => this.extractCoverUrl(manga),
      lastUpdated: manga => formatDate(manga.attributes?.updatedAt),
      source: () => 'mangadex',
      sourceId: 'id',
    };

    this.chapterMapping = {
      id: 'id',
      mangaId: chapter => this.extractMangaId(chapter),
      title: chapter => chapter.attributes?.title || '',
      chapterNumber: chapter => parseFloat(chapter.attributes?.chapter) || null,
      volume: chapter => chapter.attributes?.volume ? parseInt(chapter.attributes.volume) : null,
      language: chapter => chapter.attributes?.translatedLanguage || 'en',
      pages: chapter => chapter.attributes?.pages || 0,
      published: chapter => formatDate(chapter.attributes?.publishAt),
      group: chapter => this.extractGroup(chapter),
      source: () => 'mangadex',
      sourceId: 'id',
    };
  }

  /**
   * Gets all manga from MangaDex
   * @param {Object} options - Search options
   * @returns {Promise<Array>} - Array of manga objects
   */
  async getAllManga(options = {}) {
    const params = {
      limit: options.limit || 20,
      offset: options.page ? (options.page - 1) * (options.limit || 20) : 0,
      includes: ['cover_art', 'author', 'artist'],
      contentRating: ['safe', 'suggestive', 'erotica', 'pornographic'],
      order: options.order || { updatedAt: 'desc' },
    };

    if (options.filters) {
      if (options.filters.title) {
        params.title = options.filters.title;
      }
      if (options.filters.authors && options.filters.authors.length) {
        params.authors = options.filters.authors;
      }
      if (options.filters.artists && options.filters.artists.length) {
        params.artists = options.filters.artists;
      }
      if (options.filters.year) {
        params.year = options.filters.year;
      }
      if (options.filters.includedTags && options.filters.includedTags.length) {
        params.includedTags = options.filters.includedTags;
        params.includedTagsMode = options.filters.includedTagsMode || 'AND';
      }
      if (options.filters.excludedTags && options.filters.excludedTags.length) {
        params.excludedTags = options.filters.excludedTags;
        params.excludedTagsMode = options.filters.excludedTagsMode || 'OR';
      }
      if (options.filters.status && options.filters.status.length) {
        params.status = options.filters.status;
      }
      if (options.filters.originalLanguage && options.filters.originalLanguage.length) {
        params.originalLanguage = options.filters.originalLanguage;
      }
      if (options.filters.contentRating && options.filters.contentRating.length) {
        params.contentRating = options.filters.contentRating;
      }
    }

    try {
      const data = await fetchData(`${this.baseUrl}/manga`, { params });
      return data.data.map(manga => normalizeManga(manga, this.mangaMapping));
    } catch (error) {
      console.error('Error fetching manga from MangaDex:', error);
      throw error;
    }
  }

  /**
   * Gets a specific manga by ID
   * @param {string} id - Manga ID
   * @returns {Promise<Object>} - Manga object
   */
  async getManga(id) {
    try {
      const data = await fetchData(`${this.baseUrl}/manga/${id}`, {
        params: {
          includes: ['cover_art', 'author', 'artist'],
        },
      });
      return normalizeManga(data.data, this.mangaMapping);
    } catch (error) {
      console.error(`Error fetching manga ${id} from MangaDex:`, error);
      throw error;
    }
  }

  /**
   * Gets chapters for a manga
   * @param {string} mangaId - Manga ID
   * @param {Object} options - Filter options
   * @returns {Promise<Array>} - Array of chapter objects
   */
  async getChapters(mangaId, options = {}) {
    const params = {
      manga: mangaId,
      limit: options.limit || 100,
      offset: options.offset || 0,
      includes: ['scanlation_group'],
      order: { chapter: 'desc' },
    };

    if (options.translatedLanguage) {
      params.translatedLanguage = Array.isArray(options.translatedLanguage)
        ? options.translatedLanguage
        : [options.translatedLanguage];
    }

    try {
      const data = await fetchData(`${this.baseUrl}/chapter`, { params });
      return data.data.map(chapter => normalizeChapter(chapter, this.chapterMapping));
    } catch (error) {
      console.error(`Error fetching chapters for manga ${mangaId} from MangaDex:`, error);
      throw error;
    }
  }

  /**
   * Gets pages for a chapter
   * @param {string} chapterId - Chapter ID
   * @returns {Promise<Array>} - Array of page URLs
   */
  async getPages(chapterId) {
    try {
      const data = await fetchData(`${this.baseUrl}/at-home/server/${chapterId}`);
      const baseUrl = data.baseUrl;
      const chapter = data.chapter;

      // Use data quality by default
      const quality = 'data';
      const pages = chapter[quality].map((filename, index) => ({
        url: `${baseUrl}/${quality}/${chapter.hash}/${filename}`,
        index,
        chapterId,
      }));

      return pages;
    } catch (error) {
      console.error(`Error fetching pages for chapter ${chapterId} from MangaDex:`, error);
      throw error;
    }
  }

  /**
   * Search for manga
   * @param {string} query - Search term
   * @param {Object} options - Search options
   * @returns {Promise<Array>} - Array of manga objects
   */
  async search(query, options = {}) {
    const filters = options.filters || {};
    filters.title = query;

    return this.getAllManga({
      ...options,
      filters,
    });
  }

  /**
   * Get available genres/tags
   * @returns {Promise<Array>} - Array of genre/tag objects
   */
  async getGenres() {
    try {
      const data = await fetchData(`${this.baseUrl}/manga/tag`);
      return data.data.map(tag => ({
        id: tag.id,
        name: tag.attributes.name.en || Object.values(tag.attributes.name)[0],
        group: tag.attributes.group,
      }));
    } catch (error) {
      console.error('Error fetching genres from MangaDex:', error);
      throw error;
    }
  }

  /**
   * Extract the primary title from a manga object
   * @param {Object} manga - MangaDex manga object
   * @returns {string} - Primary title
   */
  extractTitle(manga) {
    const titles = manga.attributes?.title || {};
    return titles.en || titles.ja || titles.ko || Object.values(titles)[0] || '';
  }

  /**
   * Extract alternative titles from a manga object
   * @param {Object} manga - MangaDex manga object
   * @returns {Array<string>} - Alternative titles
   */
  extractAltTitles(manga) {
    const altTitles = manga.attributes?.altTitles || [];
    return altTitles.flatMap(title => Object.values(title));
  }

  /**
   * Extract the description from a manga object
   * @param {Object} manga - MangaDex manga object
   * @returns {string} - Description
   */
  extractDescription(manga) {
    const descriptions = manga.attributes?.description || {};
    return descriptions.en || descriptions.ja || descriptions.ko || Object.values(descriptions)[0] || '';
  }

  /**
   * Extract creators (authors or artists) from a manga object
   * @param {Object} manga - MangaDex manga object
   * @param {string} role - Creator role (author or artist)
   * @returns {Array<string>} - Creator names
   */
  extractCreators(manga, role) {
    const relationships = manga.relationships || [];
    return relationships
      .filter(rel => rel.type === role)
      .map(rel => rel.attributes?.name || rel.id);
  }

  /**
   * Extract genres from a manga object
   * @param {Object} manga - MangaDex manga object
   * @returns {Array<string>} - Genres
   */
  extractGenres(manga) {
    const tags = manga.attributes?.tags || [];
    return tags
      .filter(tag => tag.attributes?.group === 'genre')
      .map(tag => tag.attributes?.name?.en || Object.values(tag.attributes?.name || {})[0] || tag.id);
  }

  /**
   * Extract tags from a manga object
   * @param {Object} manga - MangaDex manga object
   * @returns {Array<Object>} - Tags
   */
  extractTags(manga) {
    const tags = manga.attributes?.tags || [];
    return tags.map(tag => ({
      id: tag.id,
      name: tag.attributes?.name?.en || Object.values(tag.attributes?.name || {})[0] || tag.id,
      group: tag.attributes?.group || null,
    }));
  }

  /**
   * Extract cover URL from a manga object
   * @param {Object} manga - MangaDex manga object
   * @returns {string|null} - Cover URL
   */
  extractCoverUrl(manga) {
    const relationships = manga.relationships || [];
    const coverArt = relationships.find(rel => rel.type === 'cover_art');

    if (!coverArt || !coverArt.attributes?.fileName) {
      return null;
    }

    return `https://uploads.mangadex.org/covers/${manga.id}/${coverArt.attributes.fileName}`;
  }

  /**
   * Extract manga ID from a chapter object
   * @param {Object} chapter - MangaDex chapter object
   * @returns {string|null} - Manga ID
   */
  extractMangaId(chapter) {
    const relationships = chapter.relationships || [];
    const manga = relationships.find(rel => rel.type === 'manga');
    return manga?.id || null;
  }

  /**
   * Extract group from a chapter object
   * @param {Object} chapter - MangaDex chapter object
   * @returns {string|null} - Group name
   */
  extractGroup(chapter) {
    const relationships = chapter.relationships || [];
    const group = relationships.find(rel => rel.type === 'scanlation_group');
    return group?.attributes?.name || group?.id || null;
  }
}

export default MangaDex;