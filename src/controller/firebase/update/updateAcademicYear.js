import { doc, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from "../../../server/firebaseConfig";

export async function updateAcademicYear(
	ay_id,
	acadyear,
	setBtnLoading,
	triggerAlert
) {
	try {
		setBtnLoading(true);
		const storage = getStorage();

		let ayPhotoURL = acadyear.ay_photoURL;
		if (ayPhotoURL instanceof File) {
			const photoRef = ref(storage, `academic_year/photos/photo_${Date.now()}`);
			const photoSnap = await uploadBytes(photoRef, ayPhotoURL);
			ayPhotoURL = await getDownloadURL(photoSnap.ref);
		}

		let ayBannerURL = acadyear.ay_bannerURL;
		if (ayBannerURL instanceof File) {
			const bannerRef = ref(
				storage,
				`academic_year/banners/banner_${Date.now()}`
			);
			const bannerSnap = await uploadBytes(bannerRef, ayBannerURL);
			ayBannerURL = await getDownloadURL(bannerSnap.ref);
		}

		await updateDoc(ay_id, {
			ay_academicyear: acadyear.ay_academicyear || "",
			ay_about: acadyear.ay_about || "",
			ay_photoURL: ayPhotoURL || "",
			ay_bannerURL: ayBannerURL || "",
			ay_update_timestamp: new Date(),
		});

		triggerAlert("success", "Academic year updated successfully.");
	} catch (error) {
		triggerAlert("danger", "Error updating academic year: " + error.message);
	} finally {
		setBtnLoading(false);
	}
}
