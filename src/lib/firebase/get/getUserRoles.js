import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "../../../server/firebaseConfig";

export const getMembersRoles = async (
	ay_id,
	setMember,
	setLoading,
	triggerAlert
) => {
	try {
		setLoading(true);

		const members = {
			"Organization Lead": [],
			Adviser: [],
			"Executive Board": [],
			"Core Lead": [],
			"Operations Department": [],
			"Finance Department": [],
			"Technology Department": [],
		};

		const userRef = collection(db, "users");

		const q = query(
			userRef,
			where("us_status", "==", "Active"),
			orderBy("us_create_timestamp", "desc")
		);

		const snapshot = await getDocs(q);
		if (snapshot.empty) {
			setMember([]);
			return [];
		}

		for (const docSnap of snapshot.docs) {
			const userData = { id: docSnap.id, ...docSnap.data() };

			const matchedYears = (userData.us_acadyear || []).filter(
				(item) => item.us_year === ay_id
			);

			for (const year of matchedYears) {
				const roles = year.us_role || [];
				for (const role of roles) {
					const type = role.type;
					const ro_name = role.role;

					const enrichedRole = {
						id: userData.id,
						us_fname: userData.us_fname,
						us_mname: userData.us_mname,
						us_lname: userData.us_lname,
						us_email: userData.us_email,
						us_studentID: userData.us_studentID,
						us_photoURL: userData.us_photoURL,
						us_yrname: year.us_yrname,
						us_year: year.us_year,
						us_yearName: year.us_yrname,
						ro_type: type,
						ro_name: ro_name,
					};

					if (members[type]) {
						members[type].push(enrichedRole);
					}
				}
			}
		}

		sortAllDepartments(members);
		console.log(members);
		setMember(members);
		return members;
	} catch (error) {
		triggerAlert("danger", error.message);
		console.log(error.message);
		return {};
	} finally {
		setLoading(false);
	}
};

const getPriority = (name) => {
	const lower = name.toLowerCase();
	if (lower.includes("chief")) return 0;
	if (lower.includes("lead") && !lower.includes("assistant")) return 1;
	if (lower.includes("lead assistant")) return 2;
	if (lower.includes("assistant")) return 3;
	return 99;
};

export const sortAllDepartments = (members) => {
	for (const type in members) {
		const list = members[type];
		if (!list || !list.length) continue;

		const grouped = {
			chief: [],
			others: {},
			solo: [],
		};

		list.forEach((member) => {
			const name = member.ro_name.toLowerCase();
			const baseRole = name.split(" ")[0];
			const priority = getPriority(name);

			if (priority === 0) {
				grouped.chief.push(member);
			} else {
				if (!grouped.others[baseRole]) {
					grouped.others[baseRole] = [];
				}
				grouped.others[baseRole].push({ ...member, _priority: priority });
			}
		});

		const sortedGroup = [];

		sortedGroup.push(...grouped.chief);

		for (const base in grouped.others) {
			const group = grouped.others[base];
			if (group.length === 1) {
				sortedGroup.push(group[0]);
			} else {
				group.sort((a, b) => a._priority - b._priority);
				sortedGroup.push(...group);
			}
		}

		members[type] = sortedGroup.map(({ _priority, ...rest }) => rest);
	}
};
