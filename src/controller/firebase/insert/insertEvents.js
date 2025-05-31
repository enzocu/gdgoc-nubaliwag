import {
	collection,
	addDoc,
	Timestamp,
	serverTimestamp,
	doc,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from "../../../server/firebaseConfig";
import { toTimestamp } from "../../customAction/toTimestamp";

const isBlobURL = (url) => url?.startsWith("blob:");

const uploadPhoto = async (storage, folder, file, prefix) => {
	const fileName = `${prefix}_${Date.now()}_${file.name}`;
	const storageRef = ref(storage, `${folder}/${fileName}`);
	await uploadBytes(storageRef, file);
	return await getDownloadURL(storageRef);
};

export const insertEvent = async (
	ay_id,
	event,
	organizers,
	speakers,
	gallery,
	triggerAlert,
	setBtnloading
) => {
	try {
		setBtnloading(true);
		const storage = getStorage();

		// Upload event photo if blob URL and file exists
		let eventPhotoURL = event.ev_photoURL;
		if (isBlobURL(eventPhotoURL) && event.ev_photo instanceof File) {
			eventPhotoURL = await uploadPhoto(
				storage,
				"events",
				event.ev_photo,
				"event"
			);
		}

		const eventData = {
			ev_ayID: ay_id,
			ev_organizer: organizers.map((org) => `${org.or_id}|${org.or_name}`),
			ev_status: "Upcoming",
			ev_type: event.ev_type || "",
			ev_name: event.ev_name || "",
			ev_rsvplink: event.ev_rsvplink || "",
			ev_overview: event.ev_overview || "",

			ev_date: Timestamp.fromDate(new Date(event.ev_date)),
			ev_starttime: toTimestamp(Timestamp, event.ev_date, event.ev_starttime),
			ev_endtime: toTimestamp(Timestamp, event.ev_date, event.ev_endtime),

			ev_location: event.ev_location || "",
			ev_photoURL: eventPhotoURL || "",
			ev_create_timestamp: serverTimestamp(),
		};

		const docRef = await addDoc(collection(db, "events"), eventData);
		const eventRef = doc(db, "events", docRef.id);

		// Add speakers (handle speaker photos)
		for (const sp of speakers) {
			let spPhotoURL = sp.sp_photoURL;
			if (isBlobURL(spPhotoURL) && sp.sp_photo instanceof File) {
				spPhotoURL = await uploadPhoto(
					storage,
					"speakers",
					sp.sp_photo,
					"speaker"
				);
			}

			const speakerData = {
				sp_evID: eventRef,
				sp_status: "Active",
				sp_name: sp.sp_name || "",
				sp_info: sp.sp_info || "",
				sp_photoURL: spPhotoURL || "",
				sp_create_timestamp: serverTimestamp(),
			};
			await addDoc(collection(db, "speaker"), speakerData);
		}

		// Add gallery images (handle gallery photos)
		for (const ga of gallery) {
			let gaPhotoURL = ga.ga_photoURL;
			if (isBlobURL(gaPhotoURL) && ga.ga_photo instanceof File) {
				gaPhotoURL = await uploadPhoto(
					storage,
					"gallery",
					ga.ga_photo,
					"gallery"
				);
			}

			const galleryData = {
				ph_ayID: ay_id,
				ph_evID: eventRef,
				ph_status: "Active",
				ph_type: "Event",
				ph_photoURL: gaPhotoURL || "",
				ph_create_timestamp: serverTimestamp(),
			};
			await addDoc(collection(db, "photos"), galleryData);
		}

		triggerAlert(
			"success",
			"Event inserted successfully! Document ID: " + docRef.id
		);
		return docRef.id;
	} catch (error) {
		triggerAlert("danger", "Error inserting event: " + error.message);
		throw error;
	} finally {
		setBtnloading(false);
	}
};
