import React, { useEffect, useState, useContext } from "react";
import DownloadButton from "./DownloadButton";
import "./Container.scss";
import { MainContext } from "../context/MainContextProvider";
import { Card } from "primereact/card";

function Container() {
	const { userContext, email, identity, contextLoading } = useContext(MainContext);

	return (
		<div className="polygis-container">
			<Card>
				<DownloadButton></DownloadButton>
			</Card>
		</div>
	);
}

export default Container;
