import { doc, updateDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, getStorage } from "firebase/storage";
import { db } from "../../../server/firebaseConfig";

// Utility to check for blob URL
const isBlobURL = (url) => url?.startsWith("blob:");

export const updatePhoto = async (
	photoId,
	photo,
	triggerAlert,
	setBtnloading
) => {
	try {
		setBtnloading(true);
		const storage = getStorage();
		const photoRef = doc(db, "photos", photoId);

		let photoURL = photo.ph_photoURL;

		// 🔍 Check if photo URL is a blob and if actual file is present
		if (isBlobURL(photoURL) && photo.ph_photo instanceof File) {
			const storageRef = ref(storage, `photos/${photo.ph_photo.name}`);
			await uploadBytes(storageRef, photo.ph_photo);
			photoURL = await getDownloadURL(storageRef);
		}

		const updatedData = {
			ph_ayID: doc(db, "academicyear", photo.ph_ayID),
			ph_name: photo.ph_name?.trim() || "",
			ph_type: "Chapter",
			ph_photoURL: photoURL || null,
			ph_status: photo.ph_status || "Active",
			ph_date: Timestamp.fromDate(new Date(photo.ph_date)),
			ph_update_timestamp: serverTimestamp(),
		};

		await updateDoc(photoRef, updatedData);
		triggerAlert("success", "Photo updated successfully!");
	} catch (error) {
		triggerAlert("danger", "Error updating photo: " + error.message);
		throw error;
	} finally {
		setBtnloading(false);
	}
};
