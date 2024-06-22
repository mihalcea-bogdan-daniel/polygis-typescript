import React, { useState, useContext, MouseEventHandler, useEffect } from "react";
import { Button } from "primereact/button";
import { MainContext } from "../context/MainContextProvider";
import { CadastralParcelLookupResponse, generateAndDownloadFile, geoJsonToDxf } from "../library/dxfModel";
import "./DownloadButton.scss";
import { RestApiError } from "../dto/error/RestApiErrorDto";
import { Membership } from "../types/User";
import { countiesMap } from "../types/Counties";
import { getLocalitateById } from "../utils/utils";
import ZoneDownloadButton from "./zone/ZoneDownloadButton";

interface DownloadButtonProps {
	disabled?: boolean;
}
interface MembershipDownloadCounterProps {
	memberships?: Membership[];
}

const MembershipDownloadsCounter = (props: MembershipDownloadCounterProps) => {
	if (props.memberships) {
		const premiumActiveMemberships = props.memberships.filter((membership) => membership.membership === "PREMIUM" && membership.isActive);
		const freeActiveMemberships = props.memberships.filter((membership) => membership.membership === "FREE" && membership.isActive);

		if (premiumActiveMemberships.length == 1) {
			const premiumMembership = premiumActiveMemberships[0];
			return (
				<div className="flex gap-1">
					<span>Ai descarcat de {premiumMembership.remainingDownloads} ori</span>
				</div>
			);
		} else if (freeActiveMemberships && freeActiveMemberships.length > 0) {
			const freeMembership = freeActiveMemberships[0];
			return (
				<div className="flex gap-1">
					<div className="flex flex-col gap-1">
						<span>Ti-a mai ramas un numar {freeMembership.remainingDownloads} descarcari</span>
						<span>Se reseteaza in data de {new Date(freeMembership.endsOn * 1000).toLocaleDateString("ro-RO")} la 5 descarcari</span>
					</div>
				</div>
			);
		} else {
			return (
				<div>
					<span>Nu mai ai posibilitatea sa descarci alte cadastre.</span>
					<span>Toate cadastrele descarcate pana acum le poti descarca in continuare.</span>
				</div>
			);
		}
	} else {
		return <></>;
	}
};

const DownloadButton = (props: DownloadButtonProps) => {
	const [disabled, setDisabled] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);
	const [errors, setErrors] = useState<RestApiError[]>([]);
	const [message, setMessage] = useState<string>();
	const [cadasterNumber, setCadasterNumber] = useState<string>("");

	const mainContext = useContext(MainContext);
	useEffect(() => {
		setDisabled(mainContext.email === null || !mainContext.lastClickedCadasterUrl);

		if (mainContext.userContext) {
			if (mainContext.identifyCadasterResponse) {
				setCadasterNumber(mainContext.identifyCadasterResponse.results[0]?.attributes.NATIONAL_CADASTRAL_REFERENCE);
			}
			const memberships = mainContext.userContext.memberships;
			const premiumActiveMemberships = memberships.filter((membership) => membership.membership === "PREMIUM" && membership.isActive);
			const freeActiveMemberships = memberships.filter(
				(membership) => membership.membership === "FREE" && membership.isActive && membership.remainingDownloads > 0
			);
			if (premiumActiveMemberships.length <= 0 && freeActiveMemberships.length <= 0) {
				setDisabled(true);
				return;
			}
		}
	}, [mainContext]);

	const handleClickDownload: MouseEventHandler<HTMLButtonElement> = async (e) => {
		setLoading(true);
		setErrors([]);
		if (mainContext.identifyCadasterResponse) {
			setMessage("Se verifica drepturile utilizatorului");
			let usersPostRequestBody;
			if (mainContext.identifyCadasterResponse.results.length > 0) {
				const cadaster = mainContext.identifyCadasterResponse.results[0];
				const inspireId = cadaster.attributes.INSPIRE_ID;
				const codJudet = inspireId.split(".")[1];
				const codLocalitate = Number.parseInt(inspireId.split(".")[2]);
				const numeJudet = countiesMap[codJudet];
				const localitate = await getLocalitateById(codJudet, codLocalitate);
				usersPostRequestBody = {
					INSPIRE_ID: inspireId,
					geometry: cadaster.geometry,
					layerName: cadaster.layerName,
					downloadType: "FREE",
					codJudet: numeJudet || "Neidentificat",
					codLocalitate: localitate.attributes.UAT,
				};
				try {
					const checkUserResponse = await fetch(`${process.env.BASE_URL}/public/api/v1/users/${mainContext.identity}`, {
						method: "POST",
						body: JSON.stringify(usersPostRequestBody),
						headers: {
							"Content-Type": "application/json",
						},
					});
					if (checkUserResponse.ok) {
						setMessage("Se transmit fisierele");
						const dxfContents = geoJsonToDxf(mainContext.identifyCadasterResponse);
						generateAndDownloadFile(dxfContents, mainContext.identifyCadasterResponse.results[0].attributes.INSPIRE_ID + ".dxf");
						setMessage("Se preiau ultimele descarcari ramase");
						mainContext.revalidateContext(() => {
							setMessage(undefined);
						});
					} else {
						const restApiErrorBody = await checkUserResponse.json();
						if ((restApiErrorBody.error = !undefined && restApiErrorBody.message)) {
							throw new RestApiError(restApiErrorBody.message, restApiErrorBody.status, restApiErrorBody.error);
						}
					}
				} catch (error: unknown) {
					if (error instanceof RestApiError) {
						const knownError = error as RestApiError;
						if ((knownError.error = "NO_MORE_DOWNLOADS")) {
							setDisabled(true);
						}
						setMessage(undefined);
						setErrors((prevState) => {
							prevState.push(knownError);
							return [...prevState];
						});
						return;
					}
					if (error instanceof Error) {
						const unknownError = new RestApiError("A aparut o eroare", 500, "UNKNOWN");
						setErrors((prevState) => {
							prevState.push(unknownError);
							return [...prevState];
						});
					}
				} finally {
					setMessage(undefined);
					setLoading(false);
				}
			}
		}
	};
	function handleUnmount(): void {
		if (mainContext.unmount) {
			mainContext.unmount();
		}
	}

	return (
		<div className="flex flex-col gap-1 z-50">
			<div className="flex gap-2 items-center">
				<div className="flex gap-2 justify-between w-full">
					<Button
						onClick={handleClickDownload}
						label={`Descarca DXF NC: ${cadasterNumber}`}
						disabled={disabled ? disabled : props.disabled}
						size="small"
						loading={loading || mainContext.contextLoading}></Button>
					{/* <ZoneDownloadButton /> */}
					{/* <InputText placeholder={inspireId} /> */}
					<Button rounded link onClick={handleUnmount}>
						<i className="material-symbols-outlined">close</i>
					</Button>
				</div>
				<span>{message}</span>
			</div>
			{mainContext.userContext && <MembershipDownloadsCounter memberships={mainContext.userContext?.memberships}></MembershipDownloadsCounter>}
			{errors.length > 0 && (
				<div className="text-red-600 font-bold mt-1">
					{errors.map((errObj) => {
						return <span key={errObj.error}>{errObj.message}</span>;
					})}
				</div>
			)}
		</div>
	);
};

export default DownloadButton;
