import { CADASTER_MESSAGE, USER_INFO_MESSAGES } from "./types/constants";
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
chrome.identity.getProfileUserInfo(function (info) {
	email = info.email;
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	console.log(request);
	console.log(sender);
	if (request == USER_INFO_MESSAGES.GET_USER_EMAIL) {
		sendResponse({ email: email });
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
