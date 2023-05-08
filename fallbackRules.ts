export function getFallbackUrl(dir: string) {
	const url = dir + "/fallback/index.html";
	return url;
}

export function getFallback(url: string) {
	const pivot = url.lastIndexOf("/");
	const fallbackArg = url.slice(pivot + 1);
	const fallbackUrl = url.slice(0, pivot) + "/fallback/index.html";

	return { fallbackArg, fallbackUrl };
}
