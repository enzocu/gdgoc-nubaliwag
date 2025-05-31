import {
	updateDoc,
	addDoc,
	collection,
	doc,
	Timestamp,
	serverTimestamp,
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

export const updateEvent = async (
	ay_id,
	eventId,
	event,
	organizers,
	speakers,
	gallery,
	triggerAlert,
	setBtnloading,
	navigate
) => {
	try {
		setBtnloading(true);
		const storage = getStorage();
		const eventRef = doc(db, "events", eventId);

		// Handle event photo upload
		let eventPhotoURL = event.ev_photoURL;
		if (isBlobURL(eventPhotoURL) && event.ev_photo instanceof File) {
			eventPhotoURL = await uploadPhoto(
				storage,
				"events",
				event.ev_photo,
				"event"
			);
		}

		const updatedEventData = {
			ev_organizer: organizers.map((org) => `${org.or_id}|${org.or_name}`),
			ev_type: event.ev_type || "",
			ev_name: event.ev_name || "",
			ev_rsvplink: event.ev_rsvplink || "",
			ev_overview: event.ev_overview || "",
			ev_date: Timestamp.fromDate(new Date(event.ev_date)),
			ev_starttime: toTimestamp(Timestamp, event.ev_date, event.ev_starttime),
			ev_endtime: toTimestamp(Timestamp, event.ev_date, event.ev_endtime),
			ev_location: event.ev_location || "",
			ev_photoURL: eventPhotoURL || "",
			ev_update_timestamp: serverTimestamp(),
		};

		await updateDoc(eventRef, updatedEventData);

		// Handle speakers with photo upload
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
				sp_status: sp.sp_status || "Active",
				sp_name: sp.sp_name || "",
				sp_info: sp.sp_info || "",
				sp_photoURL: spPhotoURL || "",
				...(sp.sp_id
					? { sp_update_timestamp: serverTimestamp() }
					: { sp_create_timestamp: serverTimestamp(), sp_evID: eventRef }),
			};

			if (sp.sp_id) {
				const speakerRef = doc(db, "speaker", sp.sp_id);
				await updateDoc(speakerRef, speakerData);
			} else {
				await addDoc(collection(db, "speaker"), speakerData);
			}
		}

		// Handle gallery with photo upload
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
				ph_photoURL: gaPhotoURL || "",
				ph_status: ga.ga_status || "Active",
				...(ga.ga_id
					? { ph_update_timestamp: serverTimestamp() }
					: {
							ph_ayID: ay_id,
							ph_evID: eventRef,
							ph_type: "Event",
							ph_create_timestamp: serverTimestamp(),
					  }),
			};

			if (ga.ga_id) {
				const photoRef = doc(db, "photos", ga.ga_id);
				await updateDoc(photoRef, galleryData);
			} else {
				await addDoc(collection(db, "photos"), galleryData);
			}
		}

		triggerAlert(
			"success",
			"Event updated successfully! Document ID: " + eventId
		);
		navigate("/admin/events/eventsdetails?id=" + eventId);
		return true;
	} catch (error) {
		triggerAlert("danger", "Error updating event: " + error.message);
		throw error;
	} finally {
		setBtnloading(false);
	}
};
