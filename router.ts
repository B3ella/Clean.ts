import staticBuilder from "./staticBuilder";
import mapFilesIn from "./mapFiles";
import serve, { createStringHashmap } from "./server";
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
		const dir = this.rootDir;

		const files = mapFilesIn(dir);
		const urls = files.map((file) =>
			file.replace(dir, "").replace("index.html", "")
		);

		const routes = createStringHashmap(urls, files);

		return { staticRoutes: routes, urls };
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
