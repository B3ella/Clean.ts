import { readFileSync, writeFileSync } from "fs";

interface StringHashmap {
	[key: string]: string;
}

export type { StringHashmap };

export default function staticBuilder(fileObject: StringHashmap, url: string) {
	const fileAdress = fileObject[url];

	const notHtml = !fileAdress.endsWith(".html");
	const isBuilt = url.includes("build");
	const nothingToBuild = !readFileSync(fileAdress).toString().includes("{<");
	if (notHtml || isBuilt || nothingToBuild) return;

	const file = buildFile(fileAdress);
	const buildAdress = getBuildAdress(fileAdress);
	writeFileSync(buildAdress, file);
	fileObject[url] = buildAdress;
}

function buildFile(fileAdress: string): string {
	let file = readFileSync(fileAdress).toString();

	const compStart = "{<";
	const compEnd = "/>}";

	const numberStarts = file.split(compStart).length - 1;
	const numberOfEnds = file.split(compEnd).length - 1;

	const sintaxError = numberOfEnds != numberStarts;
	if (sintaxError) return "error";

	const nothingToBuild = numberStarts == 0;
	if (nothingToBuild) return file;

	let lastEnd = 0;
	for (let i = 0; i < numberOfEnds; i++) {
		const currStart = file.indexOf(compStart, lastEnd) + compStart.length;
		const currEnd = file.indexOf(compEnd, currStart);
		const flag = file.slice(currStart, currEnd);
		const compontent = buildFile(getComponentAdress(flag, fileAdress));

		const trigger = compStart + flag + compEnd;
		file = file.replace(trigger, compontent);
		lastEnd = currEnd;
	}

	return file;
}
function getComponentAdress(flag: string, fileAdress: string): string {
	const src = getSrc(flag);

	const dirPivot = fileAdress.lastIndexOf("/") + "/".length;
	const dir = fileAdress.slice(0, dirPivot);

	const componentAdress = dir + src;
	return componentAdress;
}
function getSrc(flag: string): string {
	const srcFlag = 'src="';
	const srcStart = flag.indexOf(srcFlag) + srcFlag.length;
	const srcEnd = flag.indexOf('"', srcStart);

	return flag.slice(srcStart, srcEnd);
}

function getBuildAdress(fileAdress: string): string {
	const dirPivot = fileAdress.lastIndexOf("/") + "/".length;
	const fileName = fileAdress.slice(dirPivot);
	const dirName = fileAdress.slice(0, dirPivot);

	return dirName + "build" + fileName;
}

