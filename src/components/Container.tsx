import React, { useEffect, useState, useContext } from "react";
import DownloadButton from "./DownloadButton";
import "./Container.scss";
import { MainContext } from "../app";



function Container() {
	const mainContext = useContext(MainContext);
	return (
		<div className="polygis-container">
			<DownloadButton></DownloadButton>
			<p>
				Utilizator: <strong>{mainContext.email}</strong>
			</p>
			<p>
				Utilizator: <strong>{mainContext.identity}</strong>
			</p>
		</div>
	);
}

export default Container;
