export type MembershipName = "FREE" | "UNLIMITED" | "ZONE";

export interface Membership {
	membership: MembershipName;
	startFrom: number;
	endsOn: number;
	remainingDownloads: number;
	user: number;
}

export interface User {
	id: number;
	chromeId: string;
	email: string;
	memberships: Membership[];
	enabled: boolean;
}
