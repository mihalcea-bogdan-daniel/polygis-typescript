import { Column } from "primereact/column";
import { DataTable, DataTableStateEvent } from "primereact/datatable";
import React, { useContext, useEffect, useState } from "react";
import { MainContext } from "../../../context/MainContextProvider";
import { GET_DOWNLOAD_CADASTER_FROM_HISTORY_URL, GET_USER_CADASTER_HISTORY_URL } from "../../../types/constants";
import { ApiPageable } from "../../../types/Pageable";
import { type Cadaster } from "../../../types/Cadaster";
import { Button } from "primereact/button";
import { cadasterToDxf, generateAndDownloadFile } from "../../../library/dxfModel";
import "./CadasterHistory.scss"
const DownloadCadasterBody = (data: Cadaster) => {
	const { email, identity, contextLoading } = useContext(MainContext);
	const [loading, setLoading] = useState(false);
	const onClickDownloadHandler = () => {
		setLoading(true);
		fetch(GET_DOWNLOAD_CADASTER_FROM_HISTORY_URL(data.inspireId, identity))
			.then(async (res) => {
				if (res.ok) {
					const cadasterResponse: Cadaster = await res.json();
					const dxfModel = cadasterToDxf(cadasterResponse);
					generateAndDownloadFile(dxfModel, data.inspireId, "application/dxf");
				}
			})
			.finally(() => {
				setLoading(false);
			});
	};
	return (
		<>
			<Button type="button" className="p-0" text size="small" loading={loading} onClick={onClickDownloadHandler}>
				Descarca
			</Button>
		</>
	);
};

function CadaasterHistory() {
	const { email, identity, contextLoading } = useContext(MainContext);
	const [loading, setLoading] = useState(false);
	const [totalRecords, setTotalRecords] = useState(0);
	const [cadasters, setCadasters] = useState<Cadaster[]>([]);
	const [lazyState, setLazyState] = useState({
		first: 0,
		rows: 10,
		page: 0,
	});
	useEffect(() => {
		if (!contextLoading && email && identity) {
			loadLazyData();
		}
	}, [identity]);

	useEffect(() => {
		if (!contextLoading && email && identity) {
			loadLazyData();
		}
	}, [lazyState]);

	const loadLazyData = () => {
		setLoading(true);
		//TODO Create url object
		const historyUrl = new URL(GET_USER_CADASTER_HISTORY_URL(identity));
		historyUrl.searchParams.set("size", lazyState.rows.toString());
		historyUrl.searchParams.set("page", lazyState.page.toString());
		fetch(historyUrl).then((res) => {
			if (res.ok) {
				res.json().then((json: ApiPageable<Cadaster>) => {
					console.log(json);
					setCadasters(json.content);
					setTotalRecords(json.totalElements);
					setLoading(false);
				});
			}
		});
	};

	const onPage = (event: DataTableStateEvent) => {
		setLazyState((oldVal) => {
			return { ...oldVal, page: event.page as number, first: event.first, rows: event.rows };
		});
	};
	return (
		<div>
			<DataTable
				size="small"
				loading={contextLoading}
				title="Istoric cadastre descarcate"
				lazy
				value={cadasters}
				dataKey="inspireId"
				paginator
				first={lazyState.first}
				rows={lazyState.rows}
				totalRecords={totalRecords}
				onPage={onPage}>
				<Column header="Județ" field="codJudet"></Column>
				<Column header="Localitate" field="codLocalitate"></Column>
				<Column header="Număr cadastral" field="numarCadastral"></Column>
				<Column header="Descarca" field="inspireId" body={DownloadCadasterBody}></Column>
			</DataTable>
		</div>
	);
}

export default CadaasterHistory;
