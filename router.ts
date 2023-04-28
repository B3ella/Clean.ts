import staticBuilder from "./staticBuilder";
import mapFilesIn from "./mapFiles";
import serve from "./server";
import type { IDynamicRoutes, StringHashmap } from "./server";

export default class Router {
	port: number;
	urls: string[];
	staticRoutes: StringHashmap;
	dynamicRoutes: IDynamicRoutes;
	rootDir: string;

	constructor(dir: string, port?: number) {
		this.port = port ?? 8080;
		this.rootDir = dir;
		const { staticRoutes, urls } = this.routeDir();

		urls.forEach((url) => staticBuilder(staticRoutes, url));

		this.urls = urls;
		this.staticRoutes = staticRoutes;
		this.dynamicRoutes = {};
	}
	private routeDir() {
		const files = mapFilesIn(this.rootDir);
		const urls = files.map((file) => this.getRoute(file));

		const routes = this.createStringHashmap(urls, files);

		return { staticRoutes: routes, urls };
	}
	getRoute(file: string) {
		const relativeAdress = file.replace(this.rootDir, "");
		return relativeAdress.replace("index.html", "");
	}
	createStringHashmap(keys: string[], values: string[]): StringHashmap {
		const hashmap = {} as StringHashmap;

		for (let i = 0; i < keys.length; i++) {
			const key = keys[i];
			const value = values[i];

			hashmap[key] = value;
		}

		return hashmap;
	}

	routeFallback(url: string, func: (arg: string) => StringHashmap) {
		url = url + "/fallback.html";
		const file = this.rootDir + url;

		this.dynamicRoutes[url] = { file, func };
	}

	serve() {
		const { staticRoutes, dynamicRoutes } = this;
		serve({ staticRoutes, dynamicRoutes }, this.port);
	}
}
