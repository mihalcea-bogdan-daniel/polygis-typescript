import React, { useState, useContext, MouseEventHandler, useEffect } from "react";
import { Button } from "primereact/button";
import { MainContext } from "../app";
import { CadastralParcelLookupResponse, generateAndDownloadFile, geoJsonToDxf } from "../library/dxfModel";
import "./DownloadButton.scss";
import useFetch from "../composables/useFetch";

class RestApiError extends Error {
	status: string;
	error: string;

	/**
	 * Rest api error DTO
	 */
	constructor(message: string, status: number, error: string) {
		super(message);
		this.status = status.toString();
		this.error = error;
	}
}

interface DownloadButtonProps {
	disabled?: boolean;
}

const DownloadButton = (props: DownloadButtonProps) => {
	const [disabled, setDisabled] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);
	const [errors, setErrors] = useState<RestApiError[]>([]);
	const [message, setMessage] = useState<string>();
	const mainContext = useContext(MainContext);
	useEffect(() => {
		setDisabled(mainContext.email === null || !mainContext.lastClickedCadasterUrl);
	}, [mainContext]);

	const handleClickDownload: MouseEventHandler<HTMLButtonElement> = (e) => {
		setLoading(true);
		setErrors([]);
		if (mainContext.lastClickedCadasterUrl) {
			const cadastralGeometryUrl = new URL(mainContext.lastClickedCadasterUrl);
			cadastralGeometryUrl.searchParams.set("returnGeometry", "true");
			setMessage("Se asteapta raspunsul de la ANCPI")
			fetch(cadastralGeometryUrl)
				.then((res: Response) => {
					if (res.ok) {
						res.json().then(async (json: CadastralParcelLookupResponse) => {
							let usersPostRequestBody;
							if (json.results.length > 0) {
								const cadaster = json.results[0];
								usersPostRequestBody = {
									INSPIRE_ID: cadaster.attributes.INSPIRE_ID,
									geometry: cadaster.geometry,
									layerName: cadaster.layerName,
									downloadType: "FREE",
								};
								try {
									setMessage("Se verifica drepturile utilizatorului")
									const checkUserResponse = await fetch(`${process.env.BASE_URL}/public/api/v1/users/${mainContext.identity}`, {
										method: "POST",
										body: JSON.stringify(usersPostRequestBody),
										headers: {
											"Content-Type": "application/json",
										},
									});
									if (checkUserResponse.ok) {
										setMessage("Se transmit fisierele")
										const dxfContents = geoJsonToDxf(json);
										generateAndDownloadFile(dxfContents, json.results[0].attributes.INSPIRE_ID + ".dxf");
									} else {
										const restApiErrorBody = await checkUserResponse.json();
										if (restApiErrorBody.error == "NO_MORE_DOWNLOADS") {
											throw new RestApiError(restApiErrorBody.message, restApiErrorBody.status, restApiErrorBody.error);
										}
									}
								} catch (error: unknown) {
									if (error instanceof RestApiError) {
										const knownError = error as RestApiError;
										setMessage(undefined)
										setErrors((prevState) => {
											prevState.push(knownError);
											return [...prevState];
										});
									}
									if (error instanceof Error) {
										console.error(error);
									}
								}
							}
						});
					} else {
						setMessage("Nu s-a primit raspuns de la ANCPI, numarul de descarcari nu a fost modificat.")
						console.error(res.status, res.statusText)
					}
				})
				.finally(() => {
					setLoading(false);
				});
		}
	};
	return (
		<>
			<Button onClick={handleClickDownload} label="Descarca DXF" disabled={disabled ? disabled : props.disabled} size="small" loading={loading}></Button>
			<span>{message}</span>
			<div className="polygis-error-holder">
				{errors.map((errObj) => {
					return <span key={errObj.error}>{errObj.message}</span>;
				})}
			</div>
		</>
	);
};

export default DownloadButton;
