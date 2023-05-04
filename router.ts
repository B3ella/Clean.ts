import staticBuilder from "./staticBuilder";
import getFilesIn from "./mapFiles";
import serve, { type BackendFunction, type StaticRoutes } from "./server";
import type { IDynamicRoutes } from "./server";

export default class Router {
	staticRoutes: StaticRoutes;
	dynamicRoutes: IDynamicRoutes;
	rootDir: string;

	constructor(dir: string) {
		this.dynamicRoutes = new Map();
		this.rootDir = dir;
		this.staticRoutes = this.getStaticRoutes(dir);
	}

	private getStaticRoutes(dir: string): StaticRoutes {
		const routes: StaticRoutes = new Map();

		getFilesIn(dir).forEach((file) => {
			const url = file.replace(dir, "").replace("index.html", "");

			file = staticBuilder(file);

			routes.set(url, file);
		});
		return routes;
	}

	routeFallback(url: string, func?: BackendFunction) {
		url = url + "/fallback.html";
		const file = this.rootDir + url;

		this.dynamicRoutes.set(url, { file, func });
	}

	serve(port?: number) {
		const { staticRoutes, dynamicRoutes } = this;
		serve({ staticRoutes, dynamicRoutes }, port ?? 8080);
	}
}
