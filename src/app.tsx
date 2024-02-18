import React, { Dispatch, ReactElement, SetStateAction, createContext, useEffect, useState } from "react";
import { Root, createRoot } from "react-dom/client";
import Container from "./components/Container";
import { PrimeReactProvider } from "primereact/api";

import "./styles/main.scss";
import { CADASTER_MESSAGE, USER_INFO_MESSAGES } from "./types/constants";

interface MainContext {
	email: string | null;
	lastClickedCadasterUrl: string | null;
	lastSearchedCadasterUrl: string | null;
	lastViewExportUrl: string | null;
	setEmail?: Dispatch<SetStateAction<string | null>>;
	setLastCadasterUrl?: Dispatch<SetStateAction<string | null>>;
	setLastSearchedCadasterUrl?: Dispatch<SetStateAction<string | null>>;
	setLastViewExportUrl?: Dispatch<SetStateAction<string | null>>;
}

const mainContext: MainContext = { email: null, lastClickedCadasterUrl: null, lastSearchedCadasterUrl: null, lastViewExportUrl: null };

export const MainContext = createContext(mainContext);

export const MainContextProvider = ({ children }: { children: ReactElement }) => {
	const [email, setEmail] = useState<string | null>(null);
	const [lastClickedCadasterUrl, setLastCadasterUrl] = useState<string | null>(null);
	const [lastSearchedCadasterUrl, setLastSearchedCadasterUrl] = useState<string | null>(null);
	const [lastViewExportUrl, setLastViewExportUrl] = useState<string | null>(null);

	useEffect(() => {
		chrome.runtime.sendMessage(USER_INFO_MESSAGES.GET_USER_EMAIL, function (response) {
			if (response.email) {
				setEmail(response.email);
			}
		});
		chrome.runtime.sendMessage(CADASTER_MESSAGE.LAST_CLICKED_CADASTER, function (response) {
			if (response.lastClickedCadasterUrl) {
				setLastCadasterUrl(response.lastClickedCadasterUrl);
			} else {
				setLastCadasterUrl(null);
			}
		});
		chrome.runtime.sendMessage(CADASTER_MESSAGE.LAST_SEARCHED_CADASTER, function (response) {
			if (response.lastSearchedCadasterUrl) {
				setLastSearchedCadasterUrl(response.lastSearchedCadasterUrl);
			} else {
				setLastSearchedCadasterUrl(null);
			}
		});
		chrome.runtime.sendMessage(CADASTER_MESSAGE.LAST_VIEW_EXPORT_CADASTER, function (response) {
			if (response.lastViewExportUrl) {
				setLastViewExportUrl(response.lastViewExportUrl);
			} else {
				setLastViewExportUrl(null);
			}
		});
	}, []);

	return (
		<MainContext.Provider
			value={{
				email: email,
				setEmail: setEmail,
				lastClickedCadasterUrl: lastClickedCadasterUrl,
				setLastCadasterUrl: setLastCadasterUrl,
				lastSearchedCadasterUrl: lastSearchedCadasterUrl,
				lastViewExportUrl: lastViewExportUrl,
				setLastViewExportUrl: setLastViewExportUrl,
			}}>
			{children}
		</MainContext.Provider>
	);
};

function init() {
	const popupHolder = document.querySelector(
		"#viewDiv > div.esri-view-root > div.esri-ui.calcite-theme-light > div.esri-ui-inner-container.esri-ui-manual-container > div:nth-child(2)"
	);
	let root: Root;
	const mo = new MutationObserver((mutation) => {
		if (mutation[0].addedNodes.length > 0) {
			const container = mutation[0].addedNodes[0];
			const reactRootElement = document.createElement("div");
			reactRootElement.setAttribute("id", "polygis-app");
			container.appendChild(reactRootElement);
			root = createRoot(reactRootElement);
			root.render(
				<React.StrictMode>
					<PrimeReactProvider>
						<MainContextProvider>
							<Container />
						</MainContextProvider>
					</PrimeReactProvider>
				</React.StrictMode>
			);
		}
		if (mutation[0].removedNodes.length > 0) {
			root.unmount();
			// chrome.runtime.sendMessage(CADASTER_MESSAGE.INVALIDATE, function (response) {
			// 	if (!response.ok) {
			// 		console.error("Could not invalidate");
			// 	}
			// });
		}
	});

	if (popupHolder) {
		mo.observe(popupHolder, { childList: true });
	}
}

init();
