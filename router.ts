import staticBuilder from "./staticBuilder";
import mapFilesIn from "./mapFiles";
import serve, { createStringHashmap } from "./server";
import type { IDynamicRoutes } from "./server";

export default class Router {
	urls: string[];
	staticRoutes: Map<string, string>;
	dynamicRoutes: Map<string, IDynamicRoutes>;
	rootDir: string;

	constructor(dir: string) {
		const files = mapFilesIn(dir);
		const urls = files.map((file) =>
			file.replace(dir, "").replace("index.html", "")
		);

		const routes = createStringHashmap(urls, files);

		urls.forEach((url) => staticBuilder(routes, url));

		this.rootDir = dir;
		this.urls = urls;
		this.staticRoutes = routes;
		this.dynamicRoutes = new Map<string, IDynamicRoutes>();
	}

	routeFallback(url: string, func?: (arg: string) => Map<string, string>) {
		url = url + "/fallback.html";
		const file = this.rootDir + url;

		this.dynamicRoutes.set(url, { file, func });
	}

	serve(port?: number) {
		const { staticRoutes, dynamicRoutes } = this;
		serve({ staticRoutes, dynamicRoutes }, port ?? 8080);
	}
}
