# Genryo (原料)

Genryo (原料) is a modular manga source library for manga reader applications.

## Features

- Unified API for accessing manga from different sources
- Standardized data format across manga sources
- Automatic caching of API responses
- Easy to extend with new sources
- Support for multiple languages
- Built-in utilities for common operations

## Installation

```bash
npm install genryo
```

## Basic Usage

```javascript
import genryo from 'genryo';

// Search for manga
const searchResults = await genryo.searchManga('One Piece');
console.log(searchResults);

// Get manga details
const manga = await genryo.getManga(searchResults[0].id, searchResults[0].source);
console.log(manga);

// Get chapters
const chapters = await genryo.getChapters(manga.id, manga.source);
console.log(chapters);

// Get chapter details with pages
const chapter = await genryo.getChapterDetails(chapters[0].id, chapters[0].source);
console.log(chapter);

// Get page image URL
const imageUrl = genryo.getPageImageUrl(chapter, 0);
console.log(imageUrl);
```

## Advanced Usage

### Creating a custom instance

```javascript
import { createGenryo } from 'genryo';

// Create a custom instance with MangaPlus as the default source
const customGenryo = createGenryo('mangaplus');

// Use the custom instance
const popularManga = await customGenryo.getPopularManga();
```

### Working with specific sources

```javascript
import { createSource } from 'genryo';

// Create a MangaDex source instance
const mangadex = createSource('mangadex');

// Use the source directly
const latestManga = await mangadex.getLatestUpdates();
```

### Available Sources

- MangaDex - Popular community scanlation site
- (More sources coming soon)

## Available Methods

### Main Client

- `searchManga(query, options)` - Search for manga
- `getPopularManga(sourceId, options)` - Get popular manga
- `getLatestUpdates(sourceId, options)` - Get latest manga updates
- `getManga(id, sourceId)` - Get manga details
- `getChapters(mangaId, sourceId, options)` - Get manga chapters
- `getChapterDetails(chapterId, sourceId)` - Get chapter details with pages
- `getPageImageUrl(chapter, pageIndex, options)` - Get page image URL

### Source Class

All sources implement the following methods:

- `getId()` - Get source ID
- `getName()` - Get source name
- `getIconUrl()` - Get source icon URL
- `supportsFeature(feature)` - Check if source supports a feature
- `searchManga(query, options)` - Search for manga
- `getPopularManga(options)` - Get popular manga
- `getLatestUpdates(options)` - Get latest manga updates
- `getManga(id)` - Get manga details
- `getChapters(mangaId, options)` - Get manga chapters
- `getChapterDetails(chapterId)` - Get chapter details with pages
- `getPageImageUrl(chapter, pageIndex, options)` - Get page image URL

## Data Types

### Manga

```typescript
type Manga = {
  id: string;
  title: string;
  altTitles: Array<{language: string, title: string}>;
  description: string;
  authors: Array<string>;
  artists: Array<string>;
  genres: Array<string>;
  tags: Array<string>;
  status: string; // 'ongoing', 'completed', 'hiatus', 'cancelled', 'unknown'
  coverUrl: string | null;
  nsfw: boolean;
  source: string;
  url: string | null;
  originalData: Object;
}
```

### Chapter

```typescript
type Chapter = {
  id: string;
  mangaId: string;
  title: string;
  chapterNumber: number;
  volumeNumber: number | null;
  language: string;
  groupName: string | null;
  publishedAt: string;
  source: string;
  url: string | null;
  originalData: Object;
}
```

### ChapterDetails

```typescript
type ChapterDetails = {
  id: string;
  mangaId: string;
  title: string;
  chapterNumber: number;
  volumeNumber: number | null;
  language: string;
  groupName: string | null;
  publishedAt: string;
  source: string;
  url: string | null;
  pages: Array<string>;
  pageCount: number;
  // Additional source-specific data
  [key: string]: any;
  originalData: Object;
}
```

## Creating a New Source

To create a new source, create a new file under `src/sources` that extends the `Source` class:

```javascript
import { Source, createManga, createChapter, createChapterDetails } from '../core/source';
import metadata from './metadata.json';

export default class YourSource extends Source {
  constructor() {
    super(metadata);
  }

  // Implement required methods
  async searchManga(query, options = {}) {
    // ...
  }

  async getManga(id) {
    // ...
  }

  async getChapters(mangaId, options = {}) {
    // ...
  }

  async getChapterDetails(chapterId) {
    // ...
  }

  getPageImageUrl(chapter, pageIndex, options = {}) {
    // ...
  }
}
```

Then create a metadata.json file for your source:

```json
{
  "id": "your-source",
  "name": "Your Source",
  "version": "1.0.0",
  "description": "Extension for Your Source",
  "author": "Your Name",
  "website": "https://yoursource.com",
  "iconUrl": "https://yoursource.com/favicon.ico",
  "language": "en",
  "languages": ["en"],
  "features": ["search", "popular", "latest"]
}
```

Finally, register your source in `src/sources/index.js`.

## License

MIT