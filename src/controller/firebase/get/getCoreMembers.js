import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "../../../server/firebaseConfig";

export const getMembers = async (
	ay_id = null,
	us_type = null,
	search = null,
	setMember,
	setLoading,
	triggerAlert,
	limit = 100
) => {
	try {
		setLoading(true);

		const userRef = collection(db, "users");
		const conditions = [];

		if (us_type) {
			conditions.push(where("us_type", "==", us_type));
		}

		let q = query(
			userRef,
			...conditions,
			orderBy("us_create_timestamp", "desc")
		);

		const snapshot = await getDocs(q);
		if (snapshot.empty) {
			setMember([]);
			return [];
		}

		const users = [];

		for (const docSnap of snapshot.docs) {
			const userData = { id: docSnap.id, ...docSnap.data() };

			if (ay_id) {
				const matchesAY = (userData.us_acadyear || []).some(
					(item) => item.us_year === ay_id
				);
				if (!matchesAY) continue;

				userData.us_acadyear = (userData.us_acadyear || []).filter(
					(item) => item.us_year === ay_id
				);
			}

			if (search) {
				const searchLower = search.toLowerCase().replace(/\s+/g, " ").trim();
				const fullName = `${userData.us_fname || ""} ${
					userData.us_mname || ""
				} ${userData.us_lname || ""}`
					.toLowerCase()
					.replace(/\s+/g, " ")
					.trim();

				const matchesSearch =
					fullName.includes(searchLower) ||
					userData.us_studentID?.toLowerCase().includes(searchLower);

				if (!matchesSearch) continue;
			}

			users.push(userData);
		}

		if (limit !== 5) {
			users.sort((a, b) => {
				const nameA = `${a.us_fname || ""}`.toLowerCase();
				const nameB = `${b.us_fname || ""}`.toLowerCase();
				return nameA.localeCompare(nameB);
			});
		}

		const finalUsers = users.slice(0, limit);

		setMember(finalUsers);
		return finalUsers;
	} catch (error) {
		triggerAlert("danger", "Error fetching users: " + error.message);
		setMember([]);
		return [];
	} finally {
		setLoading(false);
	}
};
