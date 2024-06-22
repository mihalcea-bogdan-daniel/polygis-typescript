import makerjs, { IModel, IPathLine, IPoint } from "makerjs";
import { Node, parse } from "svg-parser";
import { svgTestFile } from "./svgTestFile";
import { v4 as uuidv4 } from "uuid";

const traverseSvgObject = (node: Node) => {
	let pathNodes: any[] = [];
	if (node.type == "element") {
		if (node.tagName == "path") {
			if (node.properties && node.properties["d"]) pathNodes.push(node.properties["d"] as string);
		}
		node.children.forEach((ch) => {
			if (typeof ch == "string") {
				return;
			} else {
				if (ch.type == "element") {
					pathNodes = [...pathNodes, ...traverseSvgObject(ch)];
				}
			}
		});
	}
	return pathNodes;
};

const preProcessSvg = (svgInput: string) => {
	try {
		const p = parse(svgTestFile);
		const pathStringArray: string[] | never[] = traverseSvgObject(p.children[0]);
		return pathStringArray;

		// console.log(p);
	} catch (e) {
		if (e instanceof Error) {
			console.error("Error processing SVG:", e.message);
		} else {
			console.error(e);
		}
	}
};

export const createMainModel = () => {
	const svgPaths = preProcessSvg(svgTestFile);
	const models: Record<string, IModel> = {};
	svgPaths?.forEach((path, index) => {
		const model = makerjs.importer.fromSVGPathData(path, { bezierAccuracy: 0.001 });
		// const modelPaths: Record<string, IPathLine>[] = Object.values(model);
    // const lines: makerjs.IPathLine[] = []
		// if (modelPaths[0]) {
		// 	Object.values(modelPaths[0]).forEach((line) => {
    //     lines.push(line)
		// 	});
    //   console.log(lines);
		// }
    // const points: IPoint[] =[]
    // lines.forEach((line)=> {
    //   points.push(line.origin)
    //   points.push(line.end)
    // })  
    
    // var cadastralPoints = new makerjs.models.ConnectTheDots(true, points);

    models[uuidv4()] = model;
	});
	const mirroredModel = makerjs.model.mirror({ models: models }, false, true);

	const dxf = makerjs.exporter.toDXF(mirroredModel);
	return dxf;
};
