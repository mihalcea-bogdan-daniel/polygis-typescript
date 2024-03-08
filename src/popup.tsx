import React from "react";
import { createRoot } from "react-dom/client";
import PopupMain from "./components/popup/PopupMain";
import { PrimeReactProvider } from "primereact/api";

import "./styles/popup.scss";
import "../public/css/tw-main.css";
import { MainContextProvider } from "./context/MainContextProvider";
import CheckChromeSync from "./components/popup/CheckChromeSync/CheckChromeSync";

const root = createRoot(document.getElementById("popup")!);

root.render(
	<React.StrictMode>
		<PrimeReactProvider>
			<MainContextProvider>
				<CheckChromeSync showImage>
					<PopupMain />
				</CheckChromeSync>
			</MainContextProvider>
		</PrimeReactProvider>
	</React.StrictMode>
);
