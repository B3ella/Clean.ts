import { readFileSync } from "fs";

export default function buildFile(fileAdress: string, file?: string): string {
	file = file ?? readFileSync(fileAdress).toString();

	if (nothingToBuild(file)) return file;

	const compontentElement = getComponentElement(file);

	const compontent = buildComponent(compontentElement, fileAdress);

	file = file.replace(compontentElement, compontent);

	return buildFile(fileAdress, file);
}

function nothingToBuild(file: string): boolean {
	const noOpen = !file.includes("{<div");
	const noClose = !file.includes("/>}");

	return noOpen || noClose;
}

function getComponentElement(file: string): string {
	const compStart = "{<div";
	const compEnd = "/>}";

	const compStartIndex = file.indexOf(compStart);
	const compEndIndex = file.indexOf(compEnd, compStartIndex) + compEnd.length;

	const element = file.slice(compStartIndex, compEndIndex);
	return element;
}

type StringMap = Map<string, string>;

function buildComponent(element: string, addrs: string): string {
	const atributes = isAutoClose(element)
		? getAtributes(element)
		: getAtributesWithChildren(element);

	const src = getDirAdress(addrs) + getSrc(element);
	let compontent = readFileSync(src).toString();
	const compontentBody = getHeadAndBody(compontent).body;
	compontent = mountComponent(compontentBody, atributes);

	return buildFile(addrs, compontent);
}

//To-do
function isAutoClose(element: string): boolean {
	const openTag = "{<div";
	const closeTag = ">}";
	const autoCloseTag = "/>}";

	const indexOfOpenTag = element.indexOf(openTag);

	const indexOfCloseTag = element.indexOf(closeTag) + closeTag.length;
	const indexOfAutoCloseTag =
		element.indexOf(autoCloseTag) + autoCloseTag.length;

	return indexOfAutoCloseTag === indexOfCloseTag;
}

//To-do
function getAtributes(element: string): StringMap {
	return new Map<string, string>();
}
//To-do
function getAtributesWithChildren(element: string): StringMap {
	return new Map<string, string>();
}

function getDirAdress(fileAddress: string): string {
	const dirPivot = fileAddress.lastIndexOf("/") + "/".length;
	const dirAddress = fileAddress.slice(0, dirPivot);

	return dirAddress;
}

function getSrc(element: string): string {
	const srcFlag = 'src="';
	const srcStart = element.indexOf(srcFlag) + srcFlag.length;
	const srcEnd = element.indexOf('"', srcStart);

	return element.slice(srcStart, srcEnd);
}

interface HeadAndBody {
	head?: string;
	body: string;
}

function getHeadAndBody(compontent: string): HeadAndBody {
	const containHead = compontent.includes("<head>");
	const head = containHead ? getElement(compontent, "head") : undefined;

	const containBody = compontent.includes("<body>");
	const body = containBody ? getElement(compontent, "body") : compontent;

	return { head, body };
}
function getElement(compontent: string, elementName: string): string {
	const elementOpenTag = `<${elementName}>`;
	const elementCloseTag = `</${elementName}>`;

	const elementStart =
		compontent.indexOf(elementOpenTag) + elementOpenTag.length;
	const elementEnd = compontent.indexOf(elementCloseTag);

	return compontent.slice(elementStart, elementEnd);
}

function mountComponent(compontent: string, atributes: StringMap): string {
	const nothingToBuild = noAtributesNecessary(compontent);
	if (nothingToBuild) return compontent;

	const { atribute, trigger } = getFirstAtribute(compontent);
	const value = atributes.get(atribute) ?? "";

	compontent = compontent.replace(trigger, value);

	return mountComponent(compontent, atributes);
}

function noAtributesNecessary(compontent: string): boolean {
	const noOpen = !compontent.includes("{{");
	const noClose = !compontent.includes("}}");

	return noOpen || noClose;
}

function getFirstAtribute(compontent: string): {
	atribute: string;
	trigger: string;
} {
	const start = compontent.indexOf("{{") + 2;
	const end = compontent.indexOf("}}");

	const atribute = compontent.slice(start, end);
	const trigger = `{{${atribute}}}`;

	return { atribute, trigger };
}
