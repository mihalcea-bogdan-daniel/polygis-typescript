
export type ErrorTypes = "NO_MORE_DOWNLOADS" | "USER_DISABLED" | "NULL_CADASTER" | "UNKNOWN"

export class RestApiError extends Error {
	status: string;
	error: ErrorTypes;

	/**
	 * Rest api error DTO
	 */
	constructor(message: string, status: number, error: ErrorTypes) {
		super(message);
		this.status = status.toString();
		this.error = error;
	}
}
