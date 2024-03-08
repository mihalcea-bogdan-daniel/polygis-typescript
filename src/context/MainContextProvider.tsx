import React, { Dispatch, ReactElement, SetStateAction, createContext, useEffect, useState } from "react";
import { sendMessagePromise } from "../utils/utils";
import { CADASTER_MESSAGE, USER_INFO_MESSAGES } from "../types/constants";
import { User } from "../types/User";

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
	revalidateContext: (onFinished?: () => void) => void;
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

export const getContext = async () => {
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
	chrome.storage.local.set({ context: JSON.stringify({ email, identity, userContext, lastCadasterUrl, lastSearchedCadasterUrl, lastViewExportUrl }) });
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

	const revalidateContext = (onFinished?: () => void) => {
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
				onFinished && onFinished();
				setContextLoading(false);
			});
	};

	useEffect(() => {
		revalidateContext();
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
