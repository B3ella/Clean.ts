import { readFileSync, writeFileSync } from "fs";

export default function staticBuilder(fileAdress: string): string {
	if (!fileAdress || nothingToBuild(fileAdress)) return fileAdress;

	const buildAdress = getBuildAddress(fileAdress);
	const file = buildFile(fileAdress);

	writeFileSync(buildAdress, file);
	return buildAdress;
}

function nothingToBuild(fileAdress: string): boolean {
	const notHtml = !fileAdress.endsWith(".html");
	const isBuilt = fileAdress.includes("build");
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

	const compStart = "{<div";
	const compEnd = "/>}";

	const hasComponent = file.includes(compStart) && file.includes(compEnd);
	if (!hasComponent) return file;

	const flag = getComponentFlag(file, { compEnd, compStart });

	const compontentAddress = getComponentAddress(flag, fileAdress);
	const compontent = buildFile(compontentAddress);

	const compontentBody = getHeadAndBody(compontent).body;
	const trigger = compStart + flag + compEnd;
	file = file.replace(trigger, compontentBody);

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

interface HeadAndBody {
	head?: string;
	body: string;
}
function getHeadAndBody(compontent: string): HeadAndBody {
	const containHead = compontent.includes("<head>");
	const head = containHead ? getHead(compontent) : undefined;

	const containBody = compontent.includes("<body>");
	const body = containBody ? getBody(compontent) : compontent;

	return { head, body };
}
function getHead(compontent: string): string {
	const headStart = compontent.indexOf("<head>") + "<head>".length;
	const headEnd = compontent.indexOf("</head>");

	return compontent.slice(headStart, headEnd);
}

function getBody(compontent: string): string {
	const bodyStart = compontent.indexOf("<body>") + "<body>".length;
	const bodyEnd = compontent.indexOf("</body>");

	return compontent.slice(bodyStart, bodyEnd);
}
