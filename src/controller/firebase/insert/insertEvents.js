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

		let eventPhotoURL = event.ev_photoURL;

		if (event.ev_photoURL instanceof File) {
			const eventRefPath = `events/${ay_id.id}/event_${Date.now()}`;
			const eventImageRef = ref(storage, eventRefPath);
			const snapshot = await uploadBytes(eventImageRef, event.ev_photoURL);
			eventPhotoURL = await getDownloadURL(snapshot.ref);
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

		for (const sp of speakers) {
			let spPhotoURL = sp.sp_photoURL;

			if (sp.sp_photoURL instanceof File) {
				const spPath = `events/${ay_id.id}/speakers/${
					sp.sp_name
				}_${Date.now()}`;
				const spRef = ref(storage, spPath);
				const spSnap = await uploadBytes(spRef, sp.sp_photoURL);
				spPhotoURL = await getDownloadURL(spSnap.ref);
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

		for (const ga of gallery) {
			let gaPhotoURL = ga.ga_photoURL;

			if (ga.ga_photoURL instanceof File) {
				const gaPath = `events/${ay_id.id}/gallery/gallery_${Date.now()}`;
				const gaRef = ref(storage, gaPath);
				const gaSnap = await uploadBytes(gaRef, ga.ga_photoURL);
				gaPhotoURL = await getDownloadURL(gaSnap.ref);
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

		triggerAlert("success", "Event successfully registered!");
		return docRef.id;
	} catch (error) {
		triggerAlert("danger", "Error inserting event: " + error.message);
		throw error;
	} finally {
		setBtnloading(false);
	}
};
