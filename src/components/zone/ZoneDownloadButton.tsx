import React from "react";
import { Button } from "primereact/button";

import { generateAndDownloadFile } from "../../library/dxfModel";
import { createMainModel } from './ProcessSvg';


function ZoneDownloadButton() {
	const handleClick = () => {
		const dxfZoneModel = createMainModel();
		generateAndDownloadFile(dxfZoneModel, "zone");
	};

	return (
		<div>
			<Button size="small" label="Descarca zona" onClick={handleClick}></Button>
		</div>
	);
}

export default ZoneDownloadButton;
