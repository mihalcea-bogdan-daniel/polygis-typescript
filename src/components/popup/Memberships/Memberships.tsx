import React, { ReactNode } from "react";
import { User } from "../../../types/User";

interface MembershipProps {
	user: User;
}
const Memberships: (props: MembershipProps) => JSX.Element = ({ user }) => {
	return (
		<div>
			<h3 className='mt-0'>Abonamente active</h3>
			{user.memberships.filter((membership)=>membership.isActive).map((membership) => {
				switch (membership.membership) {
					case "FREE":
						return (
							<div key={membership.membership} className="flex gap-1">
								<div className="font-semibold">GRATUIT: </div>
								<div>{membership.remainingDownloads} descarcari gratuite.</div>
								<div>Se reseteaza in data de </div>
								<div>{new Date(membership.endsOn * 1000).toLocaleDateString("ro-RO")}</div>
							</div>
						);
					case "PREMIUM":
						return (
							<div key={membership.membership} className="flex gap-1">
								<div className="font-semibold">PREMIUM: </div>
								Conturile premium pot descarca orice resurse.
							</div>
						);

					default:
						return <div key={membership.membership}>{membership.membership}</div>;
				}
			})}
		</div>
	);
};

export default Memberships;
