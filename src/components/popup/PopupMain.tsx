import React, { useContext, useEffect, useState } from "react";
import { MainContext } from "../../context/MainContextProvider";
import { ProgressSpinner } from "primereact/progressspinner";
import { Button } from "primereact/button";
import CadasterHistory from "./CadasterHistory/CadasterHistory";
import Memberships from "./Memberships/Memberships";
const Popup = () => {
	const { userContext, email, identity, contextLoading } = useContext(MainContext);
	const [loading, setLoading] = useState<boolean>(true);
	const s = ProgressSpinner;
	useEffect(() => {
		if (userContext) {
			const premiumActiveMemberships = userContext.memberships.filter((membership) => membership.membership === "PREMIUM" && membership.isActive);
			if (premiumActiveMemberships.length > 0) {
				chrome.action.setBadgeText({ text: "P" });
				return;
			}
			const freeActiveMemberships = userContext.memberships.filter((membership) => membership.membership === "FREE" && membership.isActive);
			if (freeActiveMemberships.length > 0) {
				chrome.action.setBadgeText({ text: freeActiveMemberships[0].remainingDownloads.toString() });
				return;
			}
		}
	}, [userContext]);

	return (
		<>
			<header className="mb-4 flex justify-between p-1">
				<div className="flex gap-1">
					<img src="icons/Polygis_128.png" width="54" height="54" />
					<div className="flex flex-col justify-between">
						<h2 className="my-0 text-2xl">polyGIS</h2>
						<span className="">extensia chrome</span>
					</div>
				</div>
				{userContext && <Memberships user={userContext}></Memberships>}
			</header>
			<main className="flex-1">
				<CadasterHistory></CadasterHistory>
			</main>
			<footer className="flex items-center justify-between bg-slate-700 p-1">
				<a className="link-donatie" href="https://www.buymeacoffee.com/MihalceaBogdan" target="_blank">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="12"
						height="12"
						viewBox="0 0 24 24"
						fill="#FF7C00"
						className="donation-heart"
						href="https://www.buymeacoffee.com/MihalceaBogdan">
						<path d="M12 4.248c-3.148-5.402-12-3.825-12 2.944 0 4.661 5.571 9.427 12 15.808 6.43-6.381 12-11.147 12-15.808 0-6.792-8.875-8.306-12-2.944z" />
					</svg>
					<span>Donație 2€</span>
				</a>
				<a className="link-email" href="https://t.me/+-gESj4KfO8IxOWY0" target="_blank">
					<img src='icons/telegram.svg' width={16} className='me-2'></img>
					Contact - Telegram
				</a>
			</footer>
		</>
	);
};

export default Popup;
