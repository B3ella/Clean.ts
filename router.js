"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var staticBuilder_1 = require("./staticBuilder");
var mapFiles_1 = require("./mapFiles");
var server_1 = require("./server");
var Router = /** @class */ (function () {
    function Router(dir) {
        var files = (0, mapFiles_1.default)(dir);
        var urls = files.map(function (file) {
            return file.replace(dir, "").replace("index.html", "");
        });
        var routes = (0, server_1.createStringHashmap)(urls, files);
        urls.forEach(function (url) { return (0, staticBuilder_1.default)(routes, url); });
        this.rootDir = dir;
        this.urls = urls;
        this.staticRoutes = routes;
        this.dynamicRoutes = {};
    }
    Router.prototype.routeFallback = function (url, func) {
        url = url + "/fallback.html";
        var file = this.rootDir + url;
        this.dynamicRoutes[url] = { file: file, func: func };
    };
    Router.prototype.serve = function (port) {
        var _a = this, staticRoutes = _a.staticRoutes, dynamicRoutes = _a.dynamicRoutes;
        (0, server_1.default)({ staticRoutes: staticRoutes, dynamicRoutes: dynamicRoutes }, port !== null && port !== void 0 ? port : 8080);
    };
    return Router;
}());
exports.default = Router;
