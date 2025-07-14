import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, getStorage } from "firebase/storage";
import { db } from "../../../server/firebaseConfig";

export const updateMember = async (
	ay_id,
	userId,
	member,
	triggerAlert,
	setBtnloading
) => {
	try {
		setBtnloading(true);
		const storage = getStorage();
		const userRef = doc(db, "users", userId);

		let photoURL = member.me_photoURL;

		if (member.me_photoURL instanceof File) {
			const fileRef = ref(storage, `users/${ay_id.id}/profile_${Date.now()}`);
			const snapshot = await uploadBytes(fileRef, member.me_photoURL);
			photoURL = await getDownloadURL(snapshot.ref);
		}

		const userData = {
			us_acadyear: member.me_acadyear,
			us_studentID: member.me_studentID || "",
			us_fname: member.me_fname || "",
			us_mname: member.me_mname || "",
			us_lname: member.me_lname || "",
			us_suffix: member.me_suffix || "",
			us_email: member.me_email || "",
			us_photoURL: photoURL || null,
			us_update_timestamp: serverTimestamp(),
		};

		await updateDoc(userRef, userData);

		triggerAlert("success", "Member updated successfully!");
		return true;
	} catch (error) {
		triggerAlert("danger", "Error updating user: " + error.message);
		throw error;
	} finally {
		setBtnloading(false);
	}
};
