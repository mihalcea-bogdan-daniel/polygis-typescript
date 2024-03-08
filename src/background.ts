import { User } from "./types/User";
import { CADASTER_MESSAGE, USER_INFO_MESSAGES } from "./types/constants";
import { loggly } from "./utils/utils";
function polling() {
	setTimeout(polling, 1000 * 30);
}

let lastClickedCadasterUrl: string | null;
let lastSearchedCadasterUrl: string | null;
let lastViewExportUrl: string | null;
chrome.webRequest.onBeforeRequest.addListener(
	(details) => {
		const url = new URL(details.url);

		if (url.pathname.includes("/MapServer/identify")) {
			// This url parameter contains the map extent to export to svg bbox
			lastClickedCadasterUrl = details.url;
		}
		if (url.pathname.includes("/MapServer/1/query")) {
			lastSearchedCadasterUrl = details.url;
		}
		if (url.pathname.includes("/export")) {
			lastViewExportUrl = details.url;
		}
	},
	{
		urls: ["https://geoportal.ancpi.ro/maps/rest/services/eterra3_publish/MapServer/*"],
	}
);

let email: string;
let identity: string;
chrome.identity.getProfileUserInfo(function (info) {
	email = info.email;
	identity = info.id;
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	if (request == USER_INFO_MESSAGES.GET_USER_EMAIL) {
		sendResponse({ email: email, identity: identity });
	}
	if (request == CADASTER_MESSAGE.LAST_CLICKED_CADASTER) {
		sendResponse({ lastClickedCadasterUrl: lastClickedCadasterUrl });
	}
	if (request == CADASTER_MESSAGE.LAST_SEARCHED_CADASTER) {
		sendResponse({ lastSearchedCadasterUrl: lastSearchedCadasterUrl });
	}
	if (request == CADASTER_MESSAGE.LAST_VIEW_EXPORT_CADASTER) {
		sendResponse({ lastViewExportUrl: lastViewExportUrl });
	}
	if (request == CADASTER_MESSAGE.INVALIDATE) {
		lastClickedCadasterUrl = null;
		lastSearchedCadasterUrl = null;
		lastViewExportUrl = null;
		sendResponse({ ok: true });
	}
});
polling();

chrome.runtime.onInstalled.addListener(async function (details) {
	var thisVersion = chrome.runtime.getManifest().version;

	if (details.reason == "install") {
		if (email && identity) {
			try {
				const srvResponse = await fetch(`${process.env.BASE_URL}/public/api/v1/users?email=${email}&chromeId=${identity}`);
				if (srvResponse.ok) {
					await loggly({ message: "INSTALLED_NEW_USER", body: { user: email, identity: identity } });
				}
			} catch (error) {
				await loggly({ message: "CANNOT_CREATE_USER", body: error });
			}
		}
	} else if (details.reason == "update") {
		try {
			const srvResponse = await fetch(`${process.env.BASE_URL}/public/api/v1/users?email=${email}&chromeId=${identity}`);
			if (srvResponse.ok) {
				await loggly({ message: "UPDATED", body: { user: email, identity: identity, version: thisVersion } });
			}
		} catch (error) {
			await loggly({ message: "CANNOT_UPDATED_USER", body: error });
		}
		// console.log("Updated from " + details.previousVersion + " to " + thisVersion + "!");
	}
	if (process.env.NODE_ENV != "development") {
		chrome.tabs.create({ url: "https://polygis.xyz/update/" + thisVersion });
	}
});
