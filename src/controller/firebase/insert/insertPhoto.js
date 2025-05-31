import {
	collection,
	addDoc,
	doc,
	serverTimestamp,
	Timestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, getStorage } from "firebase/storage";
import { db } from "../../../server/firebaseConfig";

// Utility to check if a string is a blob URL
const isBlobURL = (url) => url?.startsWith("blob:");

export const insertPhoto = async (photo, triggerAlert, setBtnloading) => {
	try {
		setBtnloading(true);
		const storage = getStorage();

		let photoURL = photo.ph_photoURL;

		if (isBlobURL(photoURL) && photo.ph_photo instanceof File) {
			const storageRef = ref(storage, `photos/${photo.ph_photo.name}`);
			await uploadBytes(storageRef, photo.ph_photo);
			photoURL = await getDownloadURL(storageRef);
		}

		const photoData = {
			ph_ayID: doc(db, "academicyear", photo.ph_ayID),
			ph_status: "Active",
			ph_name: photo.ph_name?.trim() || "",
			ph_type: "Chapter",
			ph_date: Timestamp.fromDate(new Date(photo.ph_date)),
			ph_photoURL: photoURL || null,
			ph_create_timestamp: serverTimestamp(),
		};

		const docRef = await addDoc(collection(db, "photos"), photoData);
		triggerAlert("success", "Photo inserted successfully!");
		return docRef.id;
	} catch (error) {
		triggerAlert("danger", "Error inserting photo: " + error.message);
		throw error;
	} finally {
		setBtnloading(false);
	}
};
