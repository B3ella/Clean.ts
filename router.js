"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var staticBuilder_1 = require("./staticBuilder");
var mapFiles_1 = require("./mapFiles");
var server_1 = require("./server");
var Router = /** @class */ (function () {
    function Router(dir) {
        this.dynamicRoutes = new Map();
        this.rootDir = dir;
        this.staticRoutes = this.getStaticRoutes(dir);
    }
    Router.prototype.getStaticRoutes = function (dir) {
        var routes = new Map();
        (0, mapFiles_1.default)(dir).forEach(function (file) {
            var url = file.replace(dir, "").replace("index.html", "");
            file = (0, staticBuilder_1.default)(file);
            routes.set(url, file);
        });
        return routes;
    };
    Router.prototype.routeFallback = function (url, func) {
        url = url + "/fallback.html";
        var file = this.rootDir + url;
        this.dynamicRoutes.set(url, { file: file, func: func });
    };
    Router.prototype.serve = function (port) {
        var _a = this, staticRoutes = _a.staticRoutes, dynamicRoutes = _a.dynamicRoutes;
        (0, server_1.default)({ staticRoutes: staticRoutes, dynamicRoutes: dynamicRoutes }, port !== null && port !== void 0 ? port : 8080);
    };
    return Router;
}());
exports.default = Router;
