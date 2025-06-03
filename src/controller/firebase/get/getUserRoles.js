import {
	collection,
	query,
	where,
	getDocs,
	doc,
	getDoc,
} from "firebase/firestore";
import { db } from "../../../server/firebaseConfig";

export const getUserRoles = async (
	ay_id = null,
	setState,
	setLoading,
	triggerAlert
) => {
	try {
		setLoading(true);

		const members = {
			"Organization Lead": [],
			"Executive Board": [],
			"Core Lead": [],
			"Operations Department": [],
			"Finance Department": [],
			"Technology Department": [],
		};

		const roleRef = collection(db, "role");
		const ayDocRef = doc(db, "academicyear", ay_id);
		const q = query(
			roleRef,
			where("ro_ayID", "==", ayDocRef),
			where("ro_status", "==", "Active")
		);

		const snapshot = await getDocs(q);
		if (snapshot.empty) {
			setState(members);
			return members;
		}

		const roles = snapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}));

		const userRoles = await mergeRoles(roles);

		const enrichedRoles = await Promise.all(
			userRoles.map(async (us) => {
				const userDetails = await getUserDetails(us.ro_usID.id);
				return {
					...us,
					user: userDetails,
				};
			})
		);

		enrichedRoles.forEach((role) => {
			const type = role.ro_type;
			if (members[type]) {
				if (role.ro_name.toLowerCase().includes("chief")) {
					members[type].unshift(role);
				} else if (role.ro_name.toLowerCase().includes("lead")) {
					const chiefsCount = members[type].filter((r) =>
						r.ro_name.toLowerCase().includes("chief")
					).length;
					members[type].splice(chiefsCount, 0, role);
				} else {
					members[type].push(role);
				}
			}
		});

		sortTechnologyDepartment(members);

		setState(members);
		return members;
	} catch (error) {
		triggerAlert("danger", error.message);
		return {};
	} finally {
		setLoading(false);
	}
};

export const getUserDetails = async (userId) => {
	try {
		if (!userId) {
			throw new Error("No userId provided");
		}

		const userRef = doc(db, "users", userId);
		const snapshot = await getDoc(userRef);

		if (!snapshot.exists()) {
			console.log("getUserDetails → User not found");
			return null;
		}

		const userData = { id: snapshot.id, ...snapshot.data() };
		return userData;
	} catch (error) {
		triggerAlert("danger", error.message);
		return null;
	}
};

export const mergeRoles = (roles = []) => {
	if (!roles.length) return [];

	const grouped = {};

	roles.forEach((role) => {
		const userId = role.ro_usID?.id || "unknown";
		const roleType = role.ro_type || "unknown";
		const key = `${userId}_${roleType}`;

		if (!grouped[key]) {
			grouped[key] = {
				ref: role.ro_usID,
				ro_type: roleType,
				roles: [],
			};
		}
		grouped[key].roles.push(role);
	});

	const merged = Object.values(grouped).map(({ ref, ro_type, roles }) => {
		const ro_name = roles.map((r) => r.ro_name).join(", ");
		const uniqueYears = [...new Set(roles.map((r) => r.ro_acadyear || "N/A"))];

		return {
			ro_usID: ref,
			ro_name,
			ro_type,
			ro_acadyear: uniqueYears.join(", "),
		};
	});

	return merged;
};
export const sortTechnologyDepartment = (members) => {
	if (
		!members["Technology Department"] ||
		!members["Technology Department"].length
	)
		return;

	const roles = {
		chief: [],
		others: {},
		solo: [],
	};

	const getPriority = (name) => {
		const lower = name.toLowerCase();
		if (lower.includes("chief")) return 0;
		if (lower.includes("lead") && !lower.includes("assistant")) return 1;
		if (lower.includes("lead assistant")) return 2;
		if (lower.includes("assistant")) return 3;
		return 99;
	};

	members["Technology Department"].forEach((member) => {
		const name = member.ro_name.toLowerCase();
		const words = name.split(" ");
		const baseRole = words[0];

		const priority = getPriority(name);

		if (priority === 0) {
			roles.chief.push(member);
		} else {
			if (!roles.others[baseRole]) {
				roles.others[baseRole] = [];
			}
			roles.others[baseRole].push({ ...member, _priority: priority });
		}
	});

	const grouped = {};
	for (const base in roles.others) {
		const group = roles.others[base];
		if (group.length === 1) {
			roles.solo.push(group[0]);
		} else {
			group.sort((a, b) => {
				if (a._priority !== b._priority) {
					return a._priority - b._priority;
				}
				return a.ro_name.localeCompare(b.ro_name);
			});
			grouped[base] = group;
		}
	}

	const finalList = [
		...roles.chief,
		...roles.solo,
		...Object.keys(grouped)
			.sort()
			.flatMap((base) => grouped[base]),
	].map(({ _priority, ...rest }) => rest);

	members["Technology Department"] = finalList;
};
