export enum CADASTER_MESSAGE {
	LAST_CLICKED_CADASTER = "get-last-clicked-cadaster",
	LAST_SEARCHED_CADASTER = "get-last-searched-cadaster",
	LAST_VIEW_EXPORT_CADASTER = "get-last-view-export",
	INVALIDATE = "invalidate"
}

export enum USER_INFO_MESSAGES {
	GET_USER_EMAIL = "get-user-email",
}

export const CHECK_USER_RIGHTS_URL = (chromeId: string) => `${process.env.BASE_URL}/public/api/v1/users/${chromeId}`

export const GET_USER_CADASTER_HISTORY_URL = (chromeId: string | null | undefined) => {
	if(!chromeId) {
		throw new Error("Invalid url, chromeId is required");
		
	}
	return `${process.env.BASE_URL}/public/api/v1/users/${chromeId}/cadasters`
}

export const GET_DOWNLOAD_CADASTER_FROM_HISTORY_URL = (inspireId: string | null | undefined, chromeId: string | null | undefined) => {
	if(!chromeId || !inspireId) {
		throw new Error("Invalid url, chromeId and inspireId are required");
		
	}
	return `${process.env.BASE_URL}/public/api/v1/users/${chromeId}/cadasters/${inspireId}`
}

export default CHECK_USER_RIGHTS_URL