import React, { useEffect, useState, useContext } from "react";
import DownloadButton from "./DownloadButton";
import "./Container.scss";

function Container() {
	return (
		<div className="polygis-container">
			<DownloadButton></DownloadButton>
		</div>
	);
}

export default Container;
