import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../../server/firebaseConfig";

export const getPhotodetails = (
	photoId,
	setPhoto,
	triggerAlert,
	setLoading,
) => {
	try {
		setLoading(true);

		const photoRef = doc(db, "photos", photoId);

		const unsubPhoto = onSnapshot(photoRef, (docSnap) => {
			if (docSnap.exists()) {
				const data = docSnap.data();

				const photoData = {
					id: docSnap.id,
					ph_ayID: data.ph_ayID?.id || "",
					ph_name: data.ph_name || "",
					ph_date: data.ph_date?.toDate().toISOString().split("T")[0] || "",
					ph_photoURL: data.ph_photoURL || "",
				};

				setPhoto(photoData);
				setLoading(false);
			} else {
				// Don't set null if it's just deleted, set safe empty object
				setPhoto({});

				// Only alert if we didn't just delete it (hard to know here, but safer not to crash)
				// triggerAlert("danger", `No photo found with ID: ${photoId}`);
			}
		});

		return unsubPhoto;
	} catch (error) {
		triggerAlert(
			"danger",
			`Error setting up real-time listener: ${error.message}`,
		);
		setPhoto({});
		setLoading(false);
	}
};
