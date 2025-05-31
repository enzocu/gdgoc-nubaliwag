import { collection, addDoc, serverTimestamp, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, getStorage } from "firebase/storage";
import { db } from "../../../server/firebaseConfig";

const isBlobURL = (url) => url?.startsWith("blob:");

export const insertUser = async (
	ay_id,
	member,
	role,
	triggerAlert,
	setBtnloading
) => {
	try {
		setBtnloading(true);
		const storage = getStorage();

		let photoURL = member.me_photoURL;

		if (isBlobURL(photoURL) && member.me_photo instanceof File) {
			const fileName = `${member.me_studentID}_${Date.now()}_${
				member.me_photo.name
			}`;
			const storageRef = ref(storage, `users/${fileName}`);
			await uploadBytes(storageRef, member.me_photo);
			photoURL = await getDownloadURL(storageRef);
		}

		const userData = {
			us_status: "Active",
			us_ayID: ay_id,
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

		for (const ro of role) {
			const roleData = {
				ro_usID: docRef,
				ro_ayID: doc(db, "academicyear", ro.ro_ayID),
				ro_status: "Active",
				ro_name: ro.ro_name || "",
				ro_acadyear: ro.ro_acadyear,
				ro_type: ro.ro_type,
				ro_create_timestamp: serverTimestamp(),
			};
			await addDoc(collection(db, "role"), roleData);
		}

		triggerAlert("success", "User inserted successfully! ID: " + docRef.id);
		return docRef.id;
	} catch (error) {
		triggerAlert("danger", "Error inserting user: " + error.message);
		throw error;
	} finally {
		setBtnloading(false);
	}
};
