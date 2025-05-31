import {
	doc,
	updateDoc,
	setDoc,
	serverTimestamp,
	collection,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, getStorage } from "firebase/storage";
import { db } from "../../../server/firebaseConfig";

const isBlobURL = (url) => url?.startsWith("blob:");

export const updateUser = async (
	currentAcadyear,
	userId,
	member,
	role,
	triggerAlert,
	setBtnloading
) => {
	try {
		setBtnloading(true);
		const storage = getStorage();
		const userRef = doc(db, "users", userId);

		let photoURL = member.me_photoURL;

		// Upload photo if blob URL and file exists
		if (isBlobURL(photoURL) && member.me_photo instanceof File) {
			const fileName = `${member.me_studentID}_${Date.now()}_${
				member.me_photo.name
			}`;
			const storageRef = ref(storage, `users/${fileName}`);
			await uploadBytes(storageRef, member.me_photo);
			photoURL = await getDownloadURL(storageRef);
		}

		const userData = {
			us_studentID: member.me_studentID || "",
			us_fname: member.me_fname || "",
			us_mname: member.me_mname || "",
			us_lname: member.me_lname || "",
			us_suffix: member.me_suffix || "",
			us_email: member.me_email || "",
			us_photoURL: photoURL || null,
			us_status: "Active",
			us_update_timestamp: serverTimestamp(),
		};

		await updateDoc(userRef, userData);

		for (const ro of role) {
			const roleRef = ro.ro_id
				? doc(db, "role", ro.ro_id)
				: doc(collection(db, "role"));

			const roleData = {
				ro_usID: userRef,
				ro_ayID: doc(db, "academicyear", ro.ro_ayID),
				ro_status: ro.ro_status || "Active",
				ro_name: ro.ro_name || "",
				ro_acadyear: ro.ro_acadyear || "",
				ro_type: ro.ro_type || "",
				ro_create_timestamp: serverTimestamp(),
			};

			if (ro.ro_id) {
				await updateDoc(roleRef, roleData);

				if (
					currentAcadyear.id === ro.ro_ayID &&
					member.me_ayID.id !== ro.ro_ayID
				) {
					await updateDoc(userRef, { us_ayID: currentAcadyear });
				}
			} else {
				await setDoc(roleRef, roleData);
			}
		}

		triggerAlert("success", "User updated successfully!");
		return true;
	} catch (error) {
		triggerAlert("danger", "Error updating user: " + error.message);
		throw error;
	} finally {
		setBtnloading(false);
	}
};
