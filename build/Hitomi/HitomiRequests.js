"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hitomiRequest = hitomiRequest;
const requestManager = new paperback_extensions_common_1.RequestManager({
    requestsPerSecond: 2,
    requestTimeout: 20000
});
async function hitomiRequest(url) {
    return requestManager.schedule(new paperback_extensions_common_1.Request({
        url,
        method: 'GET',
        headers: {
            'User-Agent': 'Paperback'
        }
    }), 1);
}
