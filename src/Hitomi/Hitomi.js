"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hitomi = exports.HitomiInfo = void 0;
var paperback_extensions_common_1 = require("paperback-extensions-common");
var HitomiRequest_1 = require("./HitomiRequest");
var HitomiParser_1 = require("./HitomiParser");
exports.HitomiInfo = {
    version: '1.0.0',
    name: 'Hitomi.la',
    description: 'Hitomi.la reader',
    author: 'ZTS',
    websiteBaseURL: 'https://hitomi.la',
    icon: 'icon.png',
    contentRating: 'ADULT',
    language: 'EN'
};
var Hitomi = /** @class */ (function (_super) {
    __extends(Hitomi, _super);
    function Hitomi() {
        return _super.call(this, exports.HitomiInfo) || this;
    }
    /**
     * SEARCH
     */
    Hitomi.prototype.getSearchResults = function (query, metadata) {
        return __awaiter(this, void 0, void 0, function () {
            var searchTerm, encoded, url, response, galleryIds, limitedIds, results;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        searchTerm = (_a = query.title) === null || _a === void 0 ? void 0 : _a.trim();
                        if (!searchTerm) {
                            return [2 /*return*/, {
                                    results: [],
                                    metadata: null
                                }];
                        }
                        encoded = encodeURIComponent(searchTerm);
                        url = "https://hitomi.la/search.html?q=".concat(encoded);
                        return [4 /*yield*/, (0, HitomiRequest_1.hitomiRequest)(url)];
                    case 1:
                        response = _b.sent();
                        galleryIds = (0, HitomiParser_1.parseSearchGalleryIds)(response.data);
                        limitedIds = galleryIds.slice(0, 20);
                        results = limitedIds.map(function (id) { return ({
                            id: id.toString(),
                            titles: ['Loading…'],
                            image: "https://hitomi.la/galleries/".concat(id, "/cover.jpg")
                        }); });
                        return [2 /*return*/, {
                                results: results,
                                metadata: null
                            }];
                }
            });
        });
    };
    /**
     * MANGA DETAILS
     * (implemented next)
     */
    Hitomi.prototype.getMangaDetails = function (mangaId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw new Error('getMangaDetails not implemented yet');
            });
        });
    };
    /**
     * CHAPTER LIST
     * (Hitomi galleries are usually a single chapter)
     */
    Hitomi.prototype.getChapters = function (mangaId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw new Error('getChapters not implemented yet');
            });
        });
    };
    /**
     * PAGE LIST
     */
    Hitomi.prototype.getChapterDetails = function (mangaId, chapterId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw new Error('getChapterDetails not implemented yet');
            });
        });
    };
    return Hitomi;
}(paperback_extensions_common_1.ContentSource));
exports.Hitomi = Hitomi;
