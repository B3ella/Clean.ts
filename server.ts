import { createServer } from "http";
import { readFileSync } from "node:fs";
import buildSeverSide from "./serverSideBuilder";

export interface StringHashmap {
	[key: string]: string;
}

export interface IDynamicRoutes {
	[key: string]: {
		file: string;
		func?: (arg: string) => StringHashmap;
	};
}
export interface HTMLResponse {
	code: number;
	response: string | Buffer;
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
		function respondWith(htmlResponse: HTMLResponse) {
			response.statusCode = htmlResponse.code;
			response.end(htmlResponse.response);
		}

		const notFound = { code: 404, response: "" };

		if (!request.url) {
			respondWith(notFound);
			return;
		}

		const responseFile = staticRoutes[request.url];

		if (responseFile) {
			const response = readFileSync(responseFile);
			respondWith({ response, code: 200 });
			return;
		}

		const { fallbackArg, fallbackUrl } = getFallback(request.url);

		const dynamicResponse = dynamicRoutes[fallbackUrl];

		if (dynamicResponse) {
			if (!dynamicResponse.func) {
				const response = readFileSync(dynamicResponse.file);
				respondWith({ response, code: 200 });
				return;
			}

			const data = dynamicResponse.func(fallbackArg);
			const htmlResponse = buildSeverSide(dynamicResponse.file, data);

			respondWith(htmlResponse);
			return;
		}

		respondWith(notFound);
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
