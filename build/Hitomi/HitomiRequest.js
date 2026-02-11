"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hitomiRequest = hitomiRequest;
function hitomiRequest(source, url) {
    return source.requestManager.schedule(new paperback_extensions_common_1.Request({
        url,
        method: 'GET',
        headers: {
            'User-Agent': 'Paperback'
        }
    }), 1);
}
