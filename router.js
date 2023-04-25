"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var builder_1 = require("./builder");
var Router = /** @class */ (function () {
    function Router(dir) {
        this.rootDir = dir;
        var _a = this.routeDir(), staticRoutes = _a.staticRoutes, urls = _a.urls;
        var dirDiv = Router.dirDivision;
        urls.forEach(function (url) { return (0, builder_1.staticBuilder)(staticRoutes, url, dirDiv); });
        this.urls = urls;
        this.staticRoutes = staticRoutes;
        this.dynamicRoutes = {};
    }
    Router.prototype.routeDir = function () {
        var _this = this;
        var files = Router.mapFilesIn(this.rootDir);
        var urls = files.map(function (file) { return _this.getRoute(file); });
        var routes = {};
        for (var i = 0; i < urls.length; i++) {
            var url = urls[i];
            var file = files[i];
            routes[url] = file;
        }
        return { staticRoutes: routes, urls: urls };
    };
    Router.mapFilesIn = function (dir) {
        var _this = this;
        var items = (0, fs_1.readdirSync)(dir);
        var files = [];
        items.forEach(function (item) {
            var fullAdress = dir + Router.dirDivision + item;
            if (Router.isFile(item))
                files.push(fullAdress);
            else
                files.push.apply(files, _this.mapFilesIn(fullAdress));
        });
        return files;
    };
    Router.isFile = function (adress) {
        return adress.includes(".");
    };
    Router.prototype.getRoute = function (file) {
        var rootDir = this.rootDir;
        var relativeAdress = file.replace(rootDir, "");
        var url = Router.formatUrl(relativeAdress);
        return url;
    };
    Router.formatUrl = function (url) {
        url = Router.replaceAllOnFor("\\", url, "/");
        return url.replace("index.html", "");
    };
    Router.replaceAllOnFor = function (t, str, sub) {
        if (t == sub)
            return str;
        str = str.replace(t, sub);
        return str.includes(t) ? this.replaceAllOnFor(t, str, sub) : str;
    };
    Router.prototype.routeFallback = function (url, func) {
        var file = this.urlToRelativeFile(url);
        url = url + "fallback.html";
        this.dynamicRoutes[url] = { file: file, func: func };
    };
    Router.prototype.urlToRelativeFile = function (url) {
        var filePath = Router.replaceAllOnFor("/", url, Router.dirDivision);
        return this.rootDir + filePath + "fallback.html";
    };
    Router.dirDivision = process.platform.startsWith("win") ? "\\" : "/";
    return Router;
}());
exports.default = Router;
