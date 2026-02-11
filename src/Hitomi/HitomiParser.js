"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseSearchGalleryIds = parseSearchGalleryIds;
function parseSearchGalleryIds(html) {
    /**
     * Hitomi embeds gallery IDs in JS arrays like:
     * var g = [12345, 67890, ...];
     */
    var match = html.match(/var\s+g\s*=\s*(\[[^\]]+\])/);
    if (!match) {
        throw new Error('Failed to find gallery ID list in search page');
    }
    try {
        return JSON.parse(match[1]);
    }
    catch (_a) {
        throw new Error('Failed to parse gallery ID list');
    }
}
