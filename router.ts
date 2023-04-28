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

export { mapFilesIn };
