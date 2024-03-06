import React from "react";
import { Root, createRoot } from "react-dom/client";
import Container from "./components/Container";
import { PrimeReactProvider } from "primereact/api";
import "./styles/main.scss";
import "../public/css/tw-main.css";
import { MainContextProvider } from './context/MainContextProvider';

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
