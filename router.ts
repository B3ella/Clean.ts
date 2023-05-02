import staticBuilder from "./staticBuilder";
import mapFilesIn from "./mapFiles";
import serve from "./server";
import type { IDynamicRoutes } from "./server";

export default class Router {
	staticRoutes: Map<string, string>;
	dynamicRoutes: Map<string, IDynamicRoutes>;
	rootDir: string;

	constructor(dir: string) {
		const files = mapFilesIn(dir);

		const routes = new Map<string, string>();
		files.forEach((file) => {
			const url = file.replace(dir, "").replace("index.html", "");
			file = staticBuilder(file);

			routes.set(url, file);
		});

		this.rootDir = dir;
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
