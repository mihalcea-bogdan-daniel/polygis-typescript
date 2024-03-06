export type MembershipName = "FREE" | "PREMIUM" | "ZONE";

export interface Membership {
	membership: MembershipName;
	startFrom: number;
	endsOn: number;
	remainingDownloads: number;
	user: number;
	isActive: boolean;
}

export interface User {
	id: number;
	chromeId: string;
	email: string;
	memberships: Membership[];
	enabled: boolean;
	premiumUser: boolean;
}
