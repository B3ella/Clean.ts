import { createServer } from "http";
import { readFileSync } from "node:fs";
import buildSeverSide from "./serverSideBuilder";

export type BackendFunction = (arg: string) => Map<string, string>;

export type IDynamicRoutes = Map<
	string,
	{
		file: string;
		func?: BackendFunction;
	}
>;
export type StaticRoutes = Map<string, string>;

export interface HTMLResponse {
	code: number;
	response: string | Buffer;
}
interface IServeParams {
	staticRoutes: Map<string, string>;
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

		const responseFile = staticRoutes.get(request.url);

		if (responseFile) {
			const response = readFileSync(responseFile);
			respondWith({ response, code: 200 });
			return;
		}

		const { fallbackArg, fallbackUrl } = getFallback(request.url);

		const dynamicResponse = dynamicRoutes.get(fallbackUrl);

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
	const fallbackUrl = url.slice(0, pivot) + "fallback/index.html";

	return { fallbackArg, fallbackUrl };
}
