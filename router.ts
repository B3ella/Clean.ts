import staticBuilder from "./staticBuilder";
import getFilesIn from "./mapFiles";
import serve from "./server";
import type { IDynamicRoutes } from "./server";

export default class Router {
	staticRoutes: Map<string, string>;
	dynamicRoutes: Map<string, IDynamicRoutes>;
	rootDir: string;

	constructor(dir: string) {
		this.dynamicRoutes = new Map<string, IDynamicRoutes>();
		this.rootDir = dir;
		this.staticRoutes = this.getStaticRoutes(dir);
	}

	private getStaticRoutes(dir: string): Map<string, string> {
		const routes = new Map<string, string>();
		
		getFilesIn(dir).forEach((file) => {
			const url = file.replace(dir, "").replace("index.html", "");
			
			file = staticBuilder(file);

			routes.set(url, file);
		});
		return routes;
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
