import { createServer } from "http";
import { readFileSync } from "node:fs";
import htmlDynamcBuilde from "./serverSideBuilder";

export interface StringHashmap {
	[key: string]: string;
}

export interface IDynamicRoutes {
	[key: string]: {
		file: string;
		func: (arg: string) => StringHashmap;
	};
}
interface IServeParams {
	staticRoutes: StringHashmap;
	dynamicRoutes: IDynamicRoutes;
}
export default function serve(
	{ staticRoutes, dynamicRoutes }: IServeParams,
	port: number
) {
	createServer((request, response) => {
		let routeExist = false;

		function respondWithPageNotFound() {
			response.statusCode = 404;
			response.end("404, nothing to see here");
		}

		function resondWithPageFound(responseEnd: string | Buffer) {
			routeExist = true;
			response.statusCode = 200;
			response.end(responseEnd);
		}

		if (!request.url) {
			respondWithPageNotFound();
			return;
		}

		const responseFile = staticRoutes[request.url];

		if (responseFile) {
			resondWithPageFound(readFileSync(responseFile));
			return;
		}

		const { fallbackArg, fallbackUrl } = getFallback(request.url);

		const dynamicResponse = dynamicRoutes[fallbackUrl];

		if (dynamicResponse) {
			const data = dynamicResponse.func(fallbackArg);
			const htmlResponse = htmlDynamcBuilde(dynamicResponse.file, data);

			resondWithPageFound(htmlResponse);
			return;
		}

		if (!routeExist) respondWithPageNotFound();
	}).listen(port);

	console.log("server on and listining on port", port);
}

function getFallback(url: string) {
	const pivot = url.lastIndexOf("/") + 1;
	const fallbackArg = url.slice(pivot);
	const fallbackUrl = url.slice(0, pivot) + "fallback.html";

	return { fallbackArg, fallbackUrl };
}

export function createStringHashmap(
	keys: string[],
	values: string[]
): StringHashmap {
	const hashmap = {} as StringHashmap;

	for (let i = 0; i < keys.length; i++) {
		const key = keys[i];
		const value = values[i];

		hashmap[key] = value;
	}

	return hashmap;
}
