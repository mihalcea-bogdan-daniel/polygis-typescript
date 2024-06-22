import { Feature, IdentifyJsonResponse } from "../types/Cadaster";

/**
 * Promise wrapper for chrome.tabs.sendMessage
 * @param message
 * @returns {Promise<any>}
 */
export function sendMessagePromise<T>(message: string | { tabId: number | undefined }): Promise<T> {
	return new Promise((resolve, reject) => {
		chrome.runtime.sendMessage(message, (response: T) => {
			if (response) {
				resolve(response as T);
			} else {
				reject("Could not get response from chrome.runtime.sendMessage");
			}
		});
	});
}

export async function getLocalitateById(codJudet: string, codLocalitate: number): Promise<Feature> {
	return new Promise((resolve, reject) => {
		const localitateIdentifyUrl = new URL("https://geoportal.ancpi.ro/geoprocessing/rest/services/LOOKUP/UATLookup/GPServer/FastSelect/execute");
		localitateIdentifyUrl.searchParams.set("f", "json");
		localitateIdentifyUrl.searchParams.set("Expression", `WORKSPACEID = ${codJudet}`);
		fetch(localitateIdentifyUrl).then(async (res) => {
			if (res.ok) {
				const jsonResponse: IdentifyJsonResponse = await res.json();
				if (jsonResponse.results.length > 0) {
					const localities = jsonResponse.results[0].value.features;
					const locality = localities.find((locality) => locality.attributes.ADMINISTRATIVEUNITID == codLocalitate);
					if (locality) {
						resolve(locality);
					} else {
						reject({ message: "Could not find locality" });
					}
				}
			} else {
				resolve({ attributes: { ADMINISTRATIVEUNITID: -1, OID: -1, UAT: "NEIDENTIFICAT" } });
			}
		});
	});
}

interface Loggly {
	message: string;
	body: unknown;
}
export const loggly = (body: Loggly) => {
	return fetch("https://logs-01.loggly.com/inputs/f354b92f-abd5-438b-a40b-d58dd72c8d92/tag/polygis/", { method: "POST", body: JSON.stringify(body) });
};
