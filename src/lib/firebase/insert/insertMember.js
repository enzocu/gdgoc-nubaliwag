import { serverTimestamp, doc, collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, getStorage } from "firebase/storage";
import { db } from "../../../server/firebaseConfig";

export const insertMember = async (
	ay_id,
	member,
	triggerAlert,
	setBtnloading
) => {
	try {
		setBtnloading(true);
		const storage = getStorage();

		let photoURL = null;

		if (member.me_photoURL instanceof File) {
			const fileRef = ref(storage, `users/${ay_id.id}/profile_${Date.now()}`);
			const snapshot = await uploadBytes(fileRef, member.me_photoURL);
			photoURL = await getDownloadURL(snapshot.ref);
		} else if (typeof member.me_photoURL === "string") {
			photoURL =
				member.me_photoURL === ""
					? "https://firebasestorage.googleapis.com/v0/b/gdscwebsite-796a1.firebasestorage.app/o/defaultProfile.png?alt=media&token=529880f3-6887-4588-b44c-4f109991561e"
					: member.me_photoURL;
		}

		const userData = {
			us_status: "Active",
			us_acadyear: member.me_acadyear,
			us_studentID: member.me_studentID || "",
			us_fname: member.me_fname || "",
			us_mname: member.me_mname || "",
			us_lname: member.me_lname || "",
			us_suffix: member.me_suffix || "",
			us_email: member.me_email || "",
			us_photoURL: photoURL || null,
			us_create_timestamp: serverTimestamp(),
		};

		const docRef = await addDoc(collection(db, "users"), userData);

		triggerAlert("success", "Member successfully registered!");
		return docRef.id;
	} catch (error) {
		triggerAlert("danger", "Error inserting user: " + error.message);
		throw error;
	} finally {
		setBtnloading(false);
	}
};
