import { doc, updateDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../../server/firebaseConfig";

export const updatePhoto = async (
	photoId,
	photo,
	triggerAlert,
	setBtnloading
) => {
	try {
		setBtnloading(true);
		const photoRef = doc(db, "photos", photoId);

		let photoURL = null;

		if (photo.ph_photoURL instanceof File) {
			const newPhotoRef = ref(
				storage,
				`photos/${photo.ph_ayID}/cover_${Date.now()}`
			);
			const snapshot = await uploadBytes(newPhotoRef, photo.ph_photoURL);
			photoURL = await getDownloadURL(snapshot.ref);
		} else if (typeof photo.ph_photoURL === "string") {
			photoURL = photo.ph_photoURL;
		}

		const validDate = new Date(photo.ph_date);
		if (isNaN(validDate)) throw new Error("Invalid date provided.");

		const updatedData = {
			ph_ayID: doc(db, "academicyear", photo.ph_ayID),
			ph_name: photo.ph_name?.trim() || "",
			ph_type: "Chapter",
			ph_photoURL: photoURL || null,
			ph_status: photo.ph_status || "Active",
			ph_date: Timestamp.fromDate(validDate),
			ph_update_timestamp: serverTimestamp(),
		};

		await updateDoc(photoRef, updatedData);
		triggerAlert("success", "Photo updated successfully!");
	} catch (error) {
		console.error("Update error:", error);
		triggerAlert("danger", "Error updating photo: " + error.message);
		throw error;
	} finally {
		setBtnloading(false);
	}
};
