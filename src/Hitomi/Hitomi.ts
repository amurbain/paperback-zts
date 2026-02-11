import {
    ContentSource,
    SourceInfo,
    Manga,
    Chapter,
    ChapterDetails,
    SearchRequest,
    PagedResults
  } from 'paperback-extensions-common'
  
  export const HitomiInfo: SourceInfo = {
    version: '1.0.0',
    name: 'Hitomi.la',
    description: 'Hitomi.la reader',
    author: 'ZTS',
    websiteBaseURL: 'https://hitomi.la',
    icon: 'icon.png',
    contentRating: 'ADULT',
    language: 'EN'
  }
  
  export class Hitomi extends ContentSource {
    constructor() {
      super(HitomiInfo)
    }
  
    async getSearchResults(
      query: SearchRequest,
      metadata: any
    ): Promise<PagedResults<Manga>> {
      return {
        results: [],
        metadata: null
      }
    }
  
    async getMangaDetails(mangaId: string): Promise<Manga> {
      throw new Error('Not implemented')
    }
  
    async getChapters(mangaId: string): Promise<Chapter[]> {
      throw new Error('Not implemented')
    }
  
    async getChapterDetails(
      mangaId: string,
      chapterId: string
    ): Promise<ChapterDetails> {
      throw new Error('Not implemented')
    }
  }
  