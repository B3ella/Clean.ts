"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var Router = /** @class */ (function () {
    function Router(dir) {
        this.routes = this.routeDir(dir);
    }
    Router.prototype.routeFallback = function (file, url, func) {
        url = url + "fallback.html";
        var route = { file: file, url: url, backendFunc: func };
        this.routes = this.routes ? __spreadArray(__spreadArray([], this.routes, true), [route], false) : [route];
    };
    Router.prototype.routeDir = function (dir) {
        var files = mapFilesIn(dir);
        var routes = files.map(function (file) { return getRoute(file, dir); });
        return routes;
    };
    return Router;
}());
exports.default = Router;
function mapFilesIn(dir) {
    var items = (0, fs_1.readdirSync)(dir);
    var files = [];
    items.forEach(function (item) {
        var dirDivision = process.platform.startsWith("win") ? "\\" : "/";
        var fullAdress = dir + dirDivision + item;
        if (isFile(item))
            files.push(fullAdress);
        else
            files.push.apply(files, mapFilesIn(fullAdress));
    });
    return files;
}
var isFile = function (adress) { return adress.includes("."); };
function getRoute(file, rootDir) {
    var relativeAdress = file.replace(rootDir, "");
    var url = formatUrl(relativeAdress);
    return { file: file, url: url };
}
function formatUrl(url) {
    url = url.replace("\\", "/");
    url = url.includes("\\") ? formatUrl(url) : url;
    url = url.replace("index.html", "");
    return url;
}
