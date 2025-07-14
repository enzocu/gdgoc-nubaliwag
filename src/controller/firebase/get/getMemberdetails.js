import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../../server/firebaseConfig";

export const getMemberdetails = (
	userId,
	setMember,
	triggerAlert,
	setLoading
) => {
	try {
		setLoading(true);

		const userRef = doc(db, "users", userId);

		const unsubUser = onSnapshot(userRef, (docSnap) => {
			if (docSnap.exists()) {
				const data = docSnap.data();

				const sortedAcadyear = (data.us_acadyear || []).sort((a, b) =>
					(b.us_yrname || "").localeCompare(a.us_yrname || "")
				);

				setMember({
					me_acadyear: sortedAcadyear,
					me_ayID: data.us_ayID || "",
					me_fname: data.us_fname || "",
					me_mname: data.us_mname || "",
					me_lname: data.us_lname || "",
					me_suffix: data.us_suffix || "",
					me_studentID: data.us_studentID || "",
					me_email: data.us_email || "",
					me_photoURL: data.us_photoURL || null,
				});
			} else {
				triggerAlert("warning", "Member not found.");
			}
			setLoading(false);
		});

		return unsubUser;
	} catch (error) {
		triggerAlert(
			"danger",
			"Error setting up real-time listeners: " + error.message
		);
		setLoading(false);
	}
};
