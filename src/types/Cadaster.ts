export interface Cadaster {
	inspireId: string;
	codJudet: string;
	codLocalitate: string;
	numarCadastral: string;
	geometry: number[][][]
}

interface Attribute {
	OID: number;
	ADMINISTRATIVEUNITID: number;
	UAT: string;
}

interface Field {
	name: string;
	type: string;
	alias: string;
}

interface SpatialReference {
	wkt: string;
}

export interface Feature {
	attributes: Attribute;
}

interface Value {
	displayFieldName: string;
	geometryType: string;
	spatialReference: SpatialReference;
	fields: Field[];
	features: Feature[];
	exceededTransferLimit: boolean;
}

interface Result {
	paramName: string;
	dataType: string;
	value: Value;
}

export interface IdentifyJsonResponse {
	results: Result[];
	exceededTransferLimit: boolean;
	messages: any[];
}
