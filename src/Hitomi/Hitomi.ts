import {
  MangaTile,
  PagedResults,
  SearchRequest,
  ContentRating,
  IconText,
  Manga,
  MangaStatus,
  Chapter,
  ChapterDetails,
  LanguageCode
} from 'paperback-extensions-common'

import { parseSearchGalleryIds } from './HitomiParser'

export const Hitomi = {

  // Metadata
  name: 'Hitomi.la',
  version: '1.0.0',
  description: 'Hitomi.la reader',
  author: 'ZTS',
  websiteBaseURL: 'https://hitomi.la',
  contentRating: ContentRating.ADULT,

  /**
   * Search results
   */
  async getSearchResults(this: any, query: SearchRequest, metadata: any): Promise<PagedResults> {
    const searchTerm = query.title?.trim()
    if (!searchTerm) return { results: [], metadata: null }

    const response = await this.requestManager.schedule({
      url: `https://hitomi.la/search.html?q=${encodeURIComponent(searchTerm)}`,
      method: 'GET',
      headers: { 'User-Agent': 'Paperback' }
    }, 1)

    const galleryIds = parseSearchGalleryIds(response.data)

    const results: MangaTile[] = galleryIds.slice(0, 20).map(id => ({
      id: id.toString(),
      image: `https://hitomi.la/galleries/${id}/cover.jpg`,
      title: { text: 'Loading…' } as IconText
    }))

    return { results, metadata: null }
  },

  /**
   * Get manga details (title, artist, tags)
   */
  async getMangaDetails(this: any, mangaId: string): Promise<Manga> {
    const url = `https://hitomi.la/galleries/${mangaId}.html`

    const response = await this.requestManager.schedule({
      url,
      method: 'GET',
      headers: { 'User-Agent': 'Paperback' }
    }, 1)

    const $ = this.cheerio.load(response.data)

    // Title
    const title = $('h1').first().text().trim() || 'Untitled'

    // Series
    const series = $('a.series').first().text().trim() || ''

    // Artists
    const artists: string[] = []
    $('a.artist').each((_: any, el: any) => artists.push($(el).text().trim()))

    // Tags
    const tags: string[] = []
    $('a.tag').each((_: any, el: any) => tags.push($(el).text().trim()))

    // Language
    let language = $('div#gallery-info span:contains("Language")').next().text().trim()
    if (!language) language = 'Unknown'

    // Build tags array with series and language included
    const tagSections = [{
      id: 'tags',
      label: 'Tags',
      tags: tags.map(tag => ({ id: tag, label: tag }))
    }]
    if (series) {
      tagSections.push({
        id: 'series',
        label: 'Series',
        tags: [{ id: series, label: series }]
      })
    }
    if (language && language !== 'Unknown') {
      tagSections.push({
        id: 'language',
        label: 'Language',
        tags: [{ id: language, label: language }]
      })
    }

    return {
      titles: [title],
      image: `https://hitomi.la/galleries/${mangaId}/cover.jpg`,
      rating: 0,
      status: MangaStatus.UNKNOWN,
      artist: artists.join(', '),
      author: artists.join(', '),
      tags: tagSections
    }
  },

  /**
   * Get chapters (single chapter per gallery)
   */
  async getChapters(this: any, mangaId: string): Promise<Chapter[]> {
    return [
      {
        id: '1',
        mangaId,
        name: 'Full Gallery',
        langCode: LanguageCode.ENGLISH,
        chapNum: 1,
        time: new Date()
      }
    ]
  },

  /**
   * Get chapter details (all images in gallery)
   */
  async getChapterDetails(this: any, mangaId: string, chapterId: string): Promise<ChapterDetails> {
    const url = `https://hitomi.la/galleries/${mangaId}.html`

    const response = await this.requestManager.schedule({
      url,
      method: 'GET',
      headers: { 'User-Agent': 'Paperback' }
    }, 1)

    const $ = this.cheerio.load(response.data)

    // Grab all thumbnail images
    const pages: string[] = []
    $('div#thumbnail-container img').each((_: any, el: any) => {
      const src = $(el).attr('data-src') || $(el).attr('src')
      if (src) {
        const fullUrl = src.replace('/thumbnails/', '/galleries/').replace(/t\d+\.jpg$/, '.jpg')
        pages.push(fullUrl)
      }
    })

    // Fallback if no thumbnails found
    if (pages.length === 0) {
      const numPages = $('div#thumbnail-container img').length || 1
      for (let i = 1; i <= numPages; i++) {
        pages.push(`https://ltn.hitomi.la/galleries/${mangaId}/${i}.jpg`)
      }
    }

    return {
      id: chapterId,
      mangaId,
      pages,
      longStrip: false
    }
  }
}
