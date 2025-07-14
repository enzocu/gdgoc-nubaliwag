export const roleChange = (member, setMember) => {
	const {
		me_acadyear = [],
		me_roleName,
		me_roleType,
		me_roleAcadyearID,
		me_roleAcadyearName,
		me_yearIndex,
		me_roleIndex,
	} = member;

	const newRole = {
		role: me_roleName,
		type: me_roleType,
	};

	let updatedAcadyear = [...me_acadyear];

	if (me_yearIndex == null || me_roleIndex == null) {
		const targetYearIndex = updatedAcadyear.findIndex(
			(item) => item.us_year === me_roleAcadyearID
		);

		if (targetYearIndex === -1) {
			updatedAcadyear.push({
				us_year: me_roleAcadyearID,
				us_yrname: me_roleAcadyearName,
				us_role: [newRole],
			});
		} else {
			updatedAcadyear[targetYearIndex].us_role.push(newRole);
		}
	} else {
		const currentYearItem = updatedAcadyear[me_yearIndex];

		if (!currentYearItem) return;

		if (currentYearItem.us_year !== me_roleAcadyearID) {
			currentYearItem.us_role.splice(me_roleIndex, 1);

			if (currentYearItem.us_role.length === 0) {
				updatedAcadyear.splice(me_yearIndex, 1);
			}

			const targetYearIndex = updatedAcadyear.findIndex(
				(item) => item.us_year === me_roleAcadyearID
			);

			if (targetYearIndex === -1) {
				updatedAcadyear.push({
					us_year: me_roleAcadyearID,
					us_yrname: me_roleAcadyearName,
					us_role: [newRole],
				});
			} else {
				updatedAcadyear[targetYearIndex].us_role.push(newRole);
			}
		} else {
			updatedAcadyear[me_yearIndex].us_role[me_roleIndex] = newRole;
		}
	}

	console.log(updatedAcadyear);

	setMember((prev) => ({
		...prev,
		me_acadyear: updatedAcadyear,
		me_yearIndex: null,
		me_roleIndex: null,
		me_roleName: "",
		me_roleType: "",
		me_roleAcadyearID: "",
		me_roleAcadyear: "",
	}));
};
export const selectedMember = (
	me_yearIndex,
	me_roleIndex,
	member,
	setMember
) => {
	const acadyear = member.me_acadyear?.[me_yearIndex];
	const roleData = acadyear?.us_role?.[me_roleIndex];

	if (!acadyear || !roleData) return;

	setMember((prev) => ({
		...prev,
		me_yearIndex,
		me_roleIndex,
		me_roleAcadyearID: acadyear.us_year || "",
		me_roleAcadyear: acadyear.us_yrname || "",
		me_roleName: roleData.role || "",
		me_roleType: roleData.type || "",
	}));
};

export const removeMember = (me_yearIndex, me_roleIndex, setMember) => {
	setMember((prev) => {
		let updatedAcadyear = [...prev.me_acadyear];

		const yearGroup = updatedAcadyear[me_yearIndex];
		if (!yearGroup || !yearGroup.us_role) return prev;

		yearGroup.us_role.splice(me_roleIndex, 1);

		if (yearGroup.us_role.length === 0) {
			updatedAcadyear.splice(me_yearIndex, 1);
		}

		return {
			...prev,
			me_acadyear: updatedAcadyear,
			me_yearIndex: null,
			me_roleIndex: null,
			me_roleName: "",
			me_roleType: "",
			me_roleAcadyearID: "",
			me_roleAcadyear: "",
		};
	});
};
