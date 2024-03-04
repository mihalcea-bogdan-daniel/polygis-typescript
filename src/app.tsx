import React, { Dispatch, ReactElement, SetStateAction, createContext, useEffect, useState } from "react";
import { Root, createRoot } from "react-dom/client";
import Container from "./components/Container";
import { PrimeReactProvider } from "primereact/api";

import "./styles/main.scss";
import { CADASTER_MESSAGE, USER_INFO_MESSAGES } from "./types/constants";
import { User } from "./types/User";
import "../public/css/tw-main.css";
import { sendMessagePromise } from "./utils/utils";

interface MainContext {
	email: string | null;
	identity?: string | null;
	userContext: User | null;
	lastClickedCadasterUrl: string | null;
	lastSearchedCadasterUrl: string | null;
	lastViewExportUrl: string | null;
	contextLoading: boolean;
	setEmail?: Dispatch<SetStateAction<string | null>>;
	setLastCadasterUrl?: Dispatch<SetStateAction<string | null>>;
	setLastSearchedCadasterUrl?: Dispatch<SetStateAction<string | null>>;
	setLastViewExportUrl?: Dispatch<SetStateAction<string | null>>;
	revalidateContext: () => void;
}

const mainContext: MainContext = {
	email: null,
	lastClickedCadasterUrl: null,
	lastSearchedCadasterUrl: null,
	lastViewExportUrl: null,
	userContext: null,
	contextLoading: false,
	revalidateContext: () => undefined,
};

export const MainContext = createContext(mainContext);

const getContext = async () => {
	let email: string | null = null;
	let identity: string | null = null;
	let userContext: User | null = null;
	let lastCadasterUrl: string | null = null;
	let lastSearchedCadasterUrl: string | null = null;
	let lastViewExportUrl: string | null = null;
	await sendMessagePromise<{ email?: string; identity?: string }>(USER_INFO_MESSAGES.GET_USER_EMAIL).then(async (response) => {
		if (response.email) {
			email = response.email;
		}
		if (response.identity) {
			identity = response.identity;
		}
		try {
			if (response.email && response.identity) {
				const srvResponse = await fetch(`${process.env.BASE_URL}/public/api/v1/users?email=${response.email}&chromeId=${response.identity}`);
				if (srvResponse.ok) {
					const jsonsrvResponse: User | null = await srvResponse.json();
					userContext = jsonsrvResponse;
				}
			}
		} catch (error) {
			userContext = null;
		}
	});

	await sendMessagePromise<{ lastClickedCadasterUrl: string | null }>(CADASTER_MESSAGE.LAST_CLICKED_CADASTER).then((response) => {
		if (response.lastClickedCadasterUrl) {
			lastCadasterUrl = response.lastClickedCadasterUrl;
		} else {
			lastCadasterUrl = null;
		}
	});

	await sendMessagePromise<{ lastSearchedCadasterUrl: string | null }>(CADASTER_MESSAGE.LAST_SEARCHED_CADASTER).then(function (response) {
		if (response.lastSearchedCadasterUrl) {
			lastSearchedCadasterUrl = response.lastSearchedCadasterUrl;
		} else {
			lastSearchedCadasterUrl = null;
		}
	});

	await sendMessagePromise<{ lastViewExportUrl: string | null }>(CADASTER_MESSAGE.LAST_VIEW_EXPORT_CADASTER).then(function (response) {
		if (response.lastViewExportUrl) {
			lastViewExportUrl = response.lastViewExportUrl;
		} else {
			lastViewExportUrl = null;
		}
	});
	return { email, identity, userContext, lastCadasterUrl, lastSearchedCadasterUrl, lastViewExportUrl };
};

export const MainContextProvider = ({ children }: { children: ReactElement }) => {
	const [email, setEmail] = useState<string | null>(null);
	const [identity, setIdentity] = useState<string | null>(null);
	const [userContext, setUserContext] = useState<User | null>(null);
	const [lastClickedCadasterUrl, setLastCadasterUrl] = useState<string | null>(null);
	const [lastSearchedCadasterUrl, setLastSearchedCadasterUrl] = useState<string | null>(null);
	const [lastViewExportUrl, setLastViewExportUrl] = useState<string | null>(null);
	const [contextLoading, setContextLoading] = useState<boolean>(false);

	const revalidateContext = () => {
		setContextLoading(true);
		getContext()
			.then(({ email, identity, lastCadasterUrl, lastSearchedCadasterUrl, lastViewExportUrl, userContext }) => {
				setEmail(email);
				setIdentity(identity);
				setUserContext(userContext);
				setLastCadasterUrl(lastCadasterUrl);
				setLastSearchedCadasterUrl(lastSearchedCadasterUrl);
				setLastViewExportUrl(lastViewExportUrl);
			})
			.finally(() => {
				setContextLoading(false);
			});
	};

	useEffect(() => {
		revalidateContext()
	}, []);

	return (
		<MainContext.Provider
			value={{
				email: email,
				setEmail: setEmail,
				identity: identity,
				lastClickedCadasterUrl: lastClickedCadasterUrl,
				setLastCadasterUrl: setLastCadasterUrl,
				lastSearchedCadasterUrl: lastSearchedCadasterUrl,
				lastViewExportUrl: lastViewExportUrl,
				setLastViewExportUrl: setLastViewExportUrl,
				userContext: userContext,
				revalidateContext: revalidateContext,
				contextLoading: contextLoading,
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
