import { models, exporter } from "makerjs";
import { Cadaster } from "../types/Cadaster";

export interface CadastralParcelLookupResponse {
	results: CadastralParcel[];
	exceededTransferLimit: boolean;
}
export type LayerName = "Parcele cadastrale" | "Constructii";
export type Tuple = [number, number];
export type Rings = Array<Array<Tuple>>;

export interface CadastralParcel {
	layerId: number;
	layerName: LayerName;
	displayFieldName: string;
	value: string;
	attributes: Attributes;
	geometryType: string;
	geometry: Geometry;
}

export interface Attributes {
	OBJECTID: number;
	INSPIRE_ID: string;
	NATIONAL_CADASTRAL_REFERENCE: string;
	IMMOVABLE_ID: number;
	SHAPE: string;
}

export interface Geometry {
	rings: Rings;
	spatialReference: SpatialReference;
}

export interface SpatialReference {
	wkid: number;
	latestWkid: number;
}

export const cadasterToDxf = (val: Cadaster): string => {
	const dxfExporter = exporter.toDXF;
	var cadastralPoints = new models.ConnectTheDots(true, val.geometry[0]);
	return dxfExporter(cadastralPoints, { units: "m" });
};

export const geoJsonToDxf = (val: CadastralParcelLookupResponse): string => {
	const dxfExporter = exporter.toDXF;
	var cadastralPoints = new models.ConnectTheDots(true, val.results[0].geometry.rings[0]);
	return dxfExporter(cadastralPoints, { units: "m" });
};

export function generateAndDownloadFile(content: string, fileName: string, mimeType: string = "application/dxf", elementToAppend?: HTMLElement): void {
	// Create a Blob with the specified content and MIME type
	const blob = new Blob([content], { type: mimeType });

	// Create a link element
	const link = document.createElement("a");

	// Set the download attribute and create a data URI
	link.download = fileName;
	link.href = window.URL.createObjectURL(blob);

	if (!elementToAppend) {
		// Append the link to the document
		document.body.appendChild(link);

		// Trigger a click on the link to start the download
		link.click();

		// Remove the link from the document
		document.body.removeChild(link);
	} else {
		elementToAppend.appendChild(link);

		// Trigger a click on the link to start the download
		link.click();

		// Remove the link from the document
		document.body.removeChild(link);
	}
}
