import { readFileSync } from "fs";

interface IDynamicRoutes {
	[key: string]: {
		file: string;
		func: (arg: string) => StringHashmap;
	};
}

interface StringHashmap {
	[key: string]: string;
}

export type { IDynamicRoutes, StringHashmap };

function htmlDynamcBuilde(fileAdress: string, querryData: any) {
	let file = readFileSync(fileAdress).toString();

	const startChar = "{{";
	const endChar = "}}";

	const numberStarts = file.split(startChar).length - 1;
	const numberOfEnds = file.split(endChar).length - 1;

	const allThatOpenCloses = numberOfEnds === numberStarts;

	if (!allThatOpenCloses) return "problem with server, sorry";

	let lastEnd = 0;
	for (let i = 0; i < numberStarts; i++) {
		const currStart = file.indexOf(startChar, lastEnd) + startChar.length;
		const currEnd = file.indexOf(endChar, currStart);
		const flag = file.slice(currStart, currEnd);
		const substitute = querryData[flag.trim()];
		const trigger = startChar + flag + endChar;
		file = file.replace(trigger, substitute);
	}

	return file;
}

function staticBuilder() {}

export { htmlDynamcBuilde };
