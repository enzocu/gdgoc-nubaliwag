import {
	collection,
	addDoc,
	doc,
	serverTimestamp,
	Timestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../../server/firebaseConfig";

export const insertPhoto = async (photo, triggerAlert, setBtnloading) => {
	try {
		setBtnloading(true);

		let photoURL = null;
		if (photo.ph_photoURL instanceof File) {
			const photoRef = ref(
				storage,
				`photos/${photo.ph_ayID}/cover_${Date.now()}`
			);

			const snapshot = await uploadBytes(photoRef, photo.ph_photoURL);
			photoURL = await getDownloadURL(snapshot.ref);
		} else if (typeof photo.ph_photoURL === "string") {
			console.log("Using existing photo URL.");
			photoURL = photo.ph_photoURL;
		}

		// DATE
		const validDate = new Date(photo.ph_date);
		if (isNaN(validDate)) throw new Error("Invalid date provided.");

		console.log("Inserting to Firestore...");

		const photoData = {
			ph_ayID: doc(db, "academicyear", photo.ph_ayID),
			ph_status: "Active",
			ph_name: photo.ph_name?.trim() || "",
			ph_type: "Chapter",
			ph_date: Timestamp.fromDate(validDate),
			ph_photoURL: photoURL,
			ph_create_timestamp: serverTimestamp(),
		};

		const docRef = await addDoc(collection(db, "photos"), photoData);

		triggerAlert("success", "Photo successfully added!");
		return docRef.id;
	} catch (error) {
		console.error("Upload or Firestore error:", error);
		triggerAlert("danger", "Error inserting photo: " + error.message);
		throw error;
	} finally {
		setBtnloading(false);
	}
};
