"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFallback = exports.getFallbackUrl = void 0;
function getFallbackUrl(dir) {
    var url = dir + "/fallback/index.html";
    return url;
}
exports.getFallbackUrl = getFallbackUrl;
function getFallback(url) {
    var pivot = url.lastIndexOf("/");
    var fallbackArg = url.slice(pivot + 1);
    var fallbackUrl = url.slice(0, pivot) + "/fallback/index.html";
    return { fallbackArg: fallbackArg, fallbackUrl: fallbackUrl };
}
exports.getFallback = getFallback;
