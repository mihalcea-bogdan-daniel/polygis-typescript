import { useEffect, useState } from "react";

export default <T = unknown>(url: string, options?: RequestInit, chromeStorageKey?: string) => {
	const [data, setData] = useState<T | null>(null);
	const [error, setError] = useState<unknown | null>(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		(async function () {
			try {
				setLoading(true);
				const response = await fetch(url, options);

				if (response.ok) {
					const jsonResponse: T = await response.json();
					if (jsonResponse) {
						setData(jsonResponse);
					}
					if (chromeStorageKey) {
						const chromeStorageData: Record<string, T | null> = {};
						chromeStorageData[chromeStorageKey] = data;
						chrome.storage.sync.set(chromeStorageData);
					}
				}
			} catch (err) {
				setError(err);
			} finally {
				setLoading(false);
			}
		})();
	}, [url]);

	return { data, error, loading };
};
