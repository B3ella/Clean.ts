import { readFileSync, writeFileSync } from "fs";

type stringMap = Map<string, string>;

export default function staticBuilder(fileObject: stringMap, url: string) {
	const fileAdress = fileObject.get(url);

	if (!fileAdress || nothingToBuild(fileAdress, url)) return;

	const buildAdress = getBuildAddress(fileAdress);
	const file = buildFile(fileAdress);

	writeFileSync(buildAdress, file);
	fileObject.set(url, buildAdress);
}

function nothingToBuild(fileAdress: string, url: string): boolean {
	const notHtml = !fileAdress.endsWith(".html");
	const isBuilt = url.includes("build");
	if (notHtml || isBuilt) return true;

	const noComponents = !readToString(fileAdress).includes("{<");
	return noComponents;
}
function readToString(fileAdress: string): string {
	return readFileSync(fileAdress).toString();
}

function getBuildAddress(fileAdress: string): string {
	const dirPivot = fileAdress.lastIndexOf("/") + "/".length;
	const fileName = fileAdress.slice(dirPivot);
	const dirName = fileAdress.slice(0, dirPivot);

	return dirName + "build" + fileName;
}

function buildFile(fileAdress: string, file?: string): string {
	file = file ?? readToString(fileAdress);

	const compStart = "{<";
	const compEnd = "/>}";

	const hasComponent = file.includes(compStart) && file.includes(compEnd);
	if (!hasComponent) return file;

	const flag = getComponentFlag(file, { compEnd, compStart });

	const compontentAddress = getComponentAddress(flag, fileAdress);
	const compontent = buildFile(compontentAddress);

	const trigger = compStart + flag + compEnd;
	file = file.replace(trigger, compontent);

	return buildFile(fileAdress, file);
}

function getComponentFlag(
	file: string,
	{ compStart, compEnd }: { compStart: string; compEnd: string }
) {
	const compStartIndex = file.indexOf(compStart) + compStart.length;
	const compEndIndex = file.indexOf(compEnd, compStartIndex);
	const flag = file.slice(compStartIndex, compEndIndex);
	return flag;
}

function getComponentAddress(flag: string, fileAdress: string): string {
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
