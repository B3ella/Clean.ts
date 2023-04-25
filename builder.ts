import { readFileSync, writeFileSync } from "fs";

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

function staticBuilder(fileObject: StringHashmap, url: string, dirDiv: string) {
	const fileAdress = fileObject[url];

	const notHtml = !fileAdress.endsWith(".html");
	if (notHtml) return;

	let file = readFileSync(fileAdress).toString();

	const componentStart = "{<";
	const componentEnd = "/>}";

	const numberStarts = file.split(componentStart).length - 1;
	const numberOfEnds = file.split(componentEnd).length - 1;

	const sintaxError = numberOfEnds != numberStarts;
	const nothingToBuild = numberStarts == 0;

	if (sintaxError || nothingToBuild) return;

	let lastEnd = 0;
	for (let i = 0; i < numberOfEnds; i++) {
		const currStart =
			file.indexOf(componentStart, lastEnd) + componentStart.length;
		const currEnd = file.indexOf(componentEnd, currStart);
		const flag = file.slice(currStart, currEnd);
		const compontent = getComponent(flag);

		const trigger = componentStart + flag + componentEnd;
		file = file.replace(trigger, compontent);
		lastEnd = currEnd;
	}

	const dirPivot = fileAdress.lastIndexOf(dirDiv) + dirDiv.length;
	const fileName = fileAdress.slice(dirPivot);
	const dirName = fileAdress.slice(0, dirPivot);

	const buildAdress = dirName + "build" + fileName;

	writeFileSync(buildAdress, file);
	fileObject[url] = buildAdress;

	function getComponent(flag: string): string {
		const src = getSrc(flag);

		const dirPivot = fileAdress.lastIndexOf(dirDiv) + dirDiv.length;
		const dir = fileAdress.slice(0, dirPivot);

		const componentAdress = dir + src;
		return readFileSync(componentAdress).toString();
	}

	function getSrc(flag: string): string {
		const srcFlag = 'src="';
		const srcStart = flag.indexOf(srcFlag) + srcFlag.length;
		const srcEnd = flag.indexOf('"', srcStart);

		return flag.slice(srcStart, srcEnd);
	}
}

export { htmlDynamcBuilde, staticBuilder };
