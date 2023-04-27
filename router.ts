import { readdirSync } from "fs";

function mapFilesIn(dir: string) {
	const items = readdirSync(dir);
	const files: string[] = [];

	items.forEach((item) => {
		const fullAdress = dir + "/" + item;

		if (isFile(item)) files.push(fullAdress);
		else files.push(...mapFilesIn(fullAdress));
	});

	return files;
}

function isFile(adress: string) {
	return adress.includes(".");
}


function replaceAllOnFor(t: string, str: string, sub: string): string {
	if (t == sub) return str;

	str = str.replace(t, sub);
	return str.includes(t) ? replaceAllOnFor(t, str, sub) : str;
}

export { mapFilesIn, replaceAllOnFor };
