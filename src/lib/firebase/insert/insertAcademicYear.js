import {
	addDoc,
	collection,
	doc,
	getDocs,
	query,
	updateDoc,
	where,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from "../../../server/firebaseConfig";

export async function insertAcademicYear(
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

		const newDocRef = await addDoc(collection(db, "academicyear"), {
			ay_academicyear: acadyear.ay_academicyear || "",
			ay_about: acadyear.ay_about || "",
			ay_photoURL: ayPhotoURL || "",
			ay_bannerURL: ayBannerURL || "",
			ay_status: "active",
			ay_create_timestamp: new Date(),
		});

		if (ay_id) {
			await updateDoc(ay_id, {
				ay_status: "Inactive",
			});
		}

		const q = query(
			collection(db, "users"),
			where("us_status", "==", "Active"),
			where("us_type", "==", "Super Admin")
		);

		const querySnapshot = await getDocs(q);
		for (const docSnap of querySnapshot.docs) {
			const userRef = doc(db, "users", docSnap.id);
			await updateDoc(userRef, {
				us_ayID: newDocRef,
			});
		}
		triggerAlert("success", "Academic year added successfully.");
	} catch (error) {
		triggerAlert("danger", "Error adding academic year: " + error.message);
	} finally {
		setBtnLoading(false);
	}
}
