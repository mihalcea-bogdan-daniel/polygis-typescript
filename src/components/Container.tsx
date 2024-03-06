import React, { useEffect, useState, useContext } from "react";
import DownloadButton from "./DownloadButton";
import "./Container.scss";
import { MainContext } from "../context/MainContextProvider";
import { ProgressSpinner } from "primereact/progressspinner";

function Container() {
	const { userContext, email, identity, contextLoading } = useContext(MainContext);
	console.log(process.env.MODE);

	return (
		<div className="polygis-container">
			{contextLoading ? (
				<ProgressSpinner style={{ width: "50px", height: "50px" }} strokeWidth="2" fill="var(--surface-ground)" animationDuration=".5s" />
			) : (
				<DownloadButton disabled={!userContext?.enabled}></DownloadButton>
			)}
			{process.env.NODE_ENV == "development" && (
				<>
					<p>
						Utilizator: <strong>{email}</strong>
					</p>
					<p>
						Utilizator: <strong>{identity}</strong>
					</p>
					<p>
						Mod: <strong>{process.env.NODE_ENV}</strong>
					</p>
				</>
			)}
		</div>
	);
}

export default Container;
