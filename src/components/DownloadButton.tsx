import React, { useState, useContext, MouseEventHandler, useEffect } from "react";
import { Button } from "primereact/button";
import { MainContext } from "../app";
import { CadastralParcelLookupResponse, generateAndDownloadFile, geoJsonToDxf } from "../library/dxfModel";
import "./DownloadButton.scss";
interface DownloadButtonProps {
	label?: string;
}

interface ErrorObject {
	message: string;
	status: string;
}

const DownloadButton = () => {
	const [disabled, setDisabled] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);
	const [errors, setErrors] = useState<ErrorObject[]>([]);
	const mainContext = useContext(MainContext);
	useEffect(() => {
		setDisabled(mainContext.email === null || !mainContext.lastClickedCadasterUrl);
	}, [mainContext]);

	const handleClickDownload: MouseEventHandler<HTMLButtonElement> = (e) => {
		setLoading(true);
		if (mainContext.lastClickedCadasterUrl) {
			const cadastralGeometryUrl = new URL(mainContext.lastClickedCadasterUrl);
			cadastralGeometryUrl.searchParams.set("returnGeometry", "true");
			fetch(cadastralGeometryUrl)
				.then((res: Response) => {
					if (res.ok) {
						res.json().then((json: CadastralParcelLookupResponse) => {
							const dxfContents = geoJsonToDxf(json);
							generateAndDownloadFile(dxfContents, json.results[0].attributes.INSPIRE_ID + ".dxf");
						});
					} else {
						setErrors((prevState: ErrorObject[]) => {
							prevState.push({ status: "500", message: "A aparut o eroare la incarcarea parcelei." });
							return [...prevState];
						});
					}
				})
				.finally(() => {
					setLoading(false);
				});
		}
	};
	return (
		<>
			<Button onClick={handleClickDownload} label="Descarca DXF" disabled={disabled} size="small" loading={loading}></Button>
			<div className="polygis-error-holder">
				{errors.map((errObj) => {
					return <span>{errObj.message}</span>;
				})}
			</div>
		</>
	);
};

export default DownloadButton;
