"use strict";
/**
 * Extracts gallery IDs from Hitomi search results page
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseSearchGalleryIds = parseSearchGalleryIds;
function parseSearchGalleryIds(html) {
    const galleryIds = [];
    // Hitomi search results use <a href="/galleries/ID.html">
    const regex = /\/galleries\/(\d+)\.html/g;
    let match;
    while ((match = regex.exec(html)) !== null) {
        galleryIds.push(match[1]);
    }
    // Remove duplicates
    return [...new Set(galleryIds)];
}
