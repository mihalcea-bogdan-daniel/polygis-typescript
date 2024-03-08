import React, { ReactElement, useEffect, useState } from "react";
import Popup from "../PopupMain";
import { MainContext } from "../../../context/MainContextProvider";
import { sendMessagePromise } from "../../../utils/utils";
import { USER_INFO_MESSAGES } from "../../../types/constants";
interface CheckChromeSyncProps {
	children: ReactElement<typeof Popup>;
	showImage?: boolean;
}
const CheckChromeSync: (props: CheckChromeSyncProps) => JSX.Element = ({ children, showImage }) => {
	const [identity, setIdentity] = useState<string>();
	const [email, setEmail] = useState<string>();
	useEffect(() => {
		sendMessagePromise<{ email?: string; identity?: string }>(USER_INFO_MESSAGES.GET_USER_EMAIL).then(async (response) => {
			if (response.email) {
				setEmail(response.email);
			}
			if (response.identity) {
				setIdentity(response.identity);
			}
		});
	}, []);
	if (identity && email) {
		return <>{children}</>;
	} else {
		return (
			<>
				<p className="text-lg text-red-600">
					<span>Pentru ca extensia sa poata functiona, modul de "Sincronizare" trebuie sa fie activat </span>
					<a className="text-lg" href="https://support.google.com/chrome/answer/185277?hl=en&co=GENIE.Platform%3DDesktop&oco=0#zippy=" target="_blank">
						Mai multe informatii
					</a>
				</p>

				{showImage && <img src="images/activate-sync.png" className="mx-auto"></img>}
			</>
		);
	}
};

export default CheckChromeSync;
