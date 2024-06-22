import React from "react";
import { createRoot } from "react-dom/client";
import Container from "./components/Container";
import { PrimeReactProvider } from "primereact/api";
import "./styles/main.scss";
import "../public/css/tw-main.css";
import { MainContextProvider } from "./context/MainContextProvider";
import CheckChromeSync from "./components/popup/CheckChromeSync/CheckChromeSync";
export let mounted = false;

document.addEventListener("identify:cadaster", ({ detail }) => {
	chrome.runtime.sendMessage("init");
	const reactRootElement = document.createElement("div");
	reactRootElement.setAttribute("id", "polygis-app");
	const container = document.body.appendChild(reactRootElement);
	const root = createRoot(container);

	const unmount = () => {
		root.unmount();
		mounted = false;
	};
	if (!mounted) {
		root.render(
			<React.StrictMode>
				<PrimeReactProvider>
					<MainContextProvider identifyCadasterResponse={detail} unmount={unmount}>
						<CheckChromeSync>
							<Container />
						</CheckChromeSync>
					</MainContextProvider>
				</PrimeReactProvider>
			</React.StrictMode>
		);
	}
	mounted = true;
});
