"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hitomi = void 0;
const paperback_extensions_common_1 = require("paperback-extensions-common");
const HitomiParser_1 = require("./HitomiParser");
exports.Hitomi = {
    // Metadata
    name: 'Hitomi.la',
    version: '1.0.0',
    description: 'Hitomi.la reader',
    author: 'ZTS',
    websiteBaseURL: 'https://hitomi.la',
    contentRating: paperback_extensions_common_1.ContentRating.ADULT,
    /**
     * Search results
     */
    async getSearchResults(query, metadata) {
        var _a;
        const searchTerm = (_a = query.title) === null || _a === void 0 ? void 0 : _a.trim();
        if (!searchTerm)
            return { results: [], metadata: null };
        const response = await this.requestManager.schedule({
            url: `https://hitomi.la/search.html?q=${encodeURIComponent(searchTerm)}`,
            method: 'GET',
            headers: { 'User-Agent': 'Paperback' }
        }, 1);
        const galleryIds = (0, HitomiParser_1.parseSearchGalleryIds)(response.data);
        const results = galleryIds.slice(0, 20).map(id => ({
            id: id.toString(),
            image: `https://hitomi.la/galleries/${id}/cover.jpg`,
            title: { text: 'Loading…' }
        }));
        return { results, metadata: null };
    },
    /**
     * Get manga details (title, artist, tags)
     */
    async getMangaDetails(mangaId) {
        const url = `https://hitomi.la/galleries/${mangaId}.html`;
        const response = await this.requestManager.schedule({
            url,
            method: 'GET',
            headers: { 'User-Agent': 'Paperback' }
        }, 1);
        const $ = this.cheerio.load(response.data);
        // Title
        const title = $('h1').first().text().trim() || 'Untitled';
        // Series
        const series = $('a.series').first().text().trim() || '';
        // Artists
        const artists = [];
        $('a.artist').each((_, el) => artists.push($(el).text().trim()));
        // Tags
        const tags = [];
        $('a.tag').each((_, el) => tags.push($(el).text().trim()));
        // Language
        let language = $('div#gallery-info span:contains("Language")').next().text().trim();
        if (!language)
            language = 'Unknown';
        // Build tags array with series and language included
        const tagSections = [{
                id: 'tags',
                label: 'Tags',
                tags: tags.map(tag => ({ id: tag, label: tag }))
            }];
        if (series) {
            tagSections.push({
                id: 'series',
                label: 'Series',
                tags: [{ id: series, label: series }]
            });
        }
        if (language && language !== 'Unknown') {
            tagSections.push({
                id: 'language',
                label: 'Language',
                tags: [{ id: language, label: language }]
            });
        }
        return {
            titles: [title],
            image: `https://hitomi.la/galleries/${mangaId}/cover.jpg`,
            rating: 0,
            status: paperback_extensions_common_1.MangaStatus.UNKNOWN,
            artist: artists.join(', '),
            author: artists.join(', '),
            tags: tagSections
        };
    },
    /**
     * Get chapters (single chapter per gallery)
     */
    async getChapters(mangaId) {
        return [
            {
                id: '1',
                mangaId,
                name: 'Full Gallery',
                langCode: paperback_extensions_common_1.LanguageCode.ENGLISH,
                chapNum: 1,
                time: new Date()
            }
        ];
    },
    /**
     * Get chapter details (all images in gallery)
     */
    async getChapterDetails(mangaId, chapterId) {
        const url = `https://hitomi.la/galleries/${mangaId}.html`;
        const response = await this.requestManager.schedule({
            url,
            method: 'GET',
            headers: { 'User-Agent': 'Paperback' }
        }, 1);
        const $ = this.cheerio.load(response.data);
        // Grab all thumbnail images
        const pages = [];
        $('div#thumbnail-container img').each((_, el) => {
            const src = $(el).attr('data-src') || $(el).attr('src');
            if (src) {
                const fullUrl = src.replace('/thumbnails/', '/galleries/').replace(/t\d+\.jpg$/, '.jpg');
                pages.push(fullUrl);
            }
        });
        // Fallback if no thumbnails found
        if (pages.length === 0) {
            const numPages = $('div#thumbnail-container img').length || 1;
            for (let i = 1; i <= numPages; i++) {
                pages.push(`https://ltn.hitomi.la/galleries/${mangaId}/${i}.jpg`);
            }
        }
        return {
            id: chapterId,
            mangaId,
            pages,
            longStrip: false
        };
    }
};
