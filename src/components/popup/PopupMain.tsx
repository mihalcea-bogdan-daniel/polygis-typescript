import React, { useContext, useEffect, useState } from "react";
import { MainContext, getContext } from "../../context/MainContextProvider";
import { User } from "../../types/User";
import { ProgressSpinner } from "primereact/progressspinner";
import { Button } from "primereact/button";
const Popup = () => {
	const { userContext, email, identity, contextLoading } = useContext(MainContext);
	const [loading, setLoading] = useState<boolean>(true);
	const s = ProgressSpinner;
	useEffect(() => {
	chrome.action.setBadgeText({ text: "4" });
	}, []);

	return (
		<div>
			<div>
				<Button size="small" label="Hello"></Button>
				{contextLoading && (
					<ProgressSpinner style={{ width: "50px", height: "50px" }} strokeWidth="2" fill="var(--surface-ground)" animationDuration=".5s"></ProgressSpinner>
				)}
			</div>
			<div>{userContext?.chromeId}</div>
		</div>
	);
};

export default Popup;
