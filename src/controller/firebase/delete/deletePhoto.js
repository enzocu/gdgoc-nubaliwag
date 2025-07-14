import { doc, deleteDoc, getDoc } from "firebase/firestore";
import { ref, deleteObject, getStorage } from "firebase/storage";
import { db } from "../../../server/firebaseConfig";

export const deletePhoto = async (photoId, triggerAlert, setBtnloading) => {
	try {
		setBtnloading(true);

		const photoRef = doc(db, "photos", photoId);
		const snapshot = await getDoc(photoRef);

		if (snapshot.exists()) {
			const photoData = snapshot.data();
			const photoURL = photoData.url;

			if (photoURL) {
				const storage = getStorage();
				const storagePath = decodeURIComponent(
					photoURL.split("/o/")[1].split("?")[0]
				);
				const imageRef = ref(storage, storagePath);
				await deleteObject(imageRef);
			}

			await deleteDoc(photoRef);
			triggerAlert("success", "Photo and file deleted successfully!");
		} else {
			triggerAlert("warning", "Photo not found.");
		}
	} catch (error) {
		console.error("Delete error:", error);
		triggerAlert("danger", "Error deleting photo: " + error.message);
		throw error;
	} finally {
		setBtnloading(false);
	}
};
