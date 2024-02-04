import React, { useEffect, useState, useContext } from "react";
import DownloadButton from "./DownloadButton";
import "./Container.scss";
import { MainContext } from "../mutation";

function Container() {
	const mainContext = useContext(MainContext);

	return (
		<div className="polygis-container">
			<DownloadButton></DownloadButton>
			<p>
				Utilizator: <strong>{mainContext.email}</strong>
			</p>
		</div>
	);
}

export default Container;
