import {
	updateDoc,
	addDoc,
	collection,
	doc,
	deleteDoc,
	Timestamp,
	serverTimestamp,
} from "firebase/firestore";
import {
	getStorage,
	ref,
	uploadBytes,
	getDownloadURL,
	deleteObject,
} from "firebase/storage";
import { db } from "../../../server/firebaseConfig";
import { toTimestamp } from "../../customAction/toTimestamp";
import { sendOrganizerEmail } from "../../customAction/sendEmail";

export const updateEvent = async (
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

		// Upload event photo if it's a File
		let eventPhotoURL = event.ev_photoURL;
		if (event.ev_photoURL instanceof File) {
			const eventRefPath = `events/${event.ev_ayID}/event_${Date.now()}`;
			const eventImageRef = ref(storage, eventRefPath);
			const snapshot = await uploadBytes(eventImageRef, event.ev_photoURL);
			eventPhotoURL = await getDownloadURL(snapshot.ref);
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

		// SPEAKERS
		for (const sp of speakers) {
			let spPhotoURL = sp.sp_photoURL;

			if (sp.sp_photoURL instanceof File) {
				const spPath = `events/${event.ev_ayID}/speakers/${
					sp.sp_name
				}_${Date.now()}`;
				const spRef = ref(storage, spPath);
				const spSnap = await uploadBytes(spRef, sp.sp_photoURL);
				spPhotoURL = await getDownloadURL(spSnap.ref);
			}

			if (sp.sp_id) {
				const speakerRef = doc(db, "speaker", sp.sp_id);

				if (sp.sp_status === "Inactive") {
					// Remove photo if it's a Firebase URL
					if (
						typeof sp.sp_photoURL === "string" &&
						sp.sp_photoURL.includes("firebase")
					) {
						const imgPath = decodeURIComponent(
							sp.sp_photoURL.split("/o/")[1].split("?")[0]
						);
						const imgRef = ref(storage, imgPath);
						await deleteObject(imgRef).catch(() => {});
					}
					await deleteDoc(speakerRef);
				} else {
					await updateDoc(speakerRef, {
						sp_status: sp.sp_status || "Active",
						sp_name: sp.sp_name || "",
						sp_info: sp.sp_info || "",
						sp_photoURL: spPhotoURL || "",
						sp_update_timestamp: serverTimestamp(),
					});
				}
			} else {
				await addDoc(collection(db, "speaker"), {
					sp_status: sp.sp_status || "Active",
					sp_name: sp.sp_name || "",
					sp_info: sp.sp_info || "",
					sp_photoURL: spPhotoURL || "",
					sp_evID: eventRef,
					sp_create_timestamp: serverTimestamp(),
				});
			}
		}

		// GALLERY PHOTOS
		for (const ga of gallery) {
			let gaPhotoURL = ga.ga_photoURL;

			if (ga.ga_photoURL instanceof File) {
				const gaPath = `events/${event.ev_ayID}/gallery/gallery_${Date.now()}`;
				const gaRef = ref(storage, gaPath);
				const gaSnap = await uploadBytes(gaRef, ga.ga_photoURL);
				gaPhotoURL = await getDownloadURL(gaSnap.ref);
			}

			if (ga.ga_id) {
				const photoRef = doc(db, "photos", ga.ga_id);

				if (ga.ga_status === "Inactive") {
					if (
						typeof ga.ga_photoURL === "string" &&
						ga.ga_photoURL.includes("firebase")
					) {
						const imgPath = decodeURIComponent(
							ga.ga_photoURL.split("/o/")[1].split("?")[0]
						);
						const imgRef = ref(storage, imgPath);
						await deleteObject(imgRef).catch(() => {});
					}
					await deleteDoc(photoRef);
				} else {
					await updateDoc(photoRef, {
						ph_photoURL: gaPhotoURL || "",
						ph_status: ga.ga_status || "Active",
						ph_update_timestamp: serverTimestamp(),
					});
				}
			} else {
				await addDoc(collection(db, "photos"), {
					ph_ayID: doc(db, "academicyear", event.ev_ayID),
					ph_evID: eventRef,
					ph_type: "Event",
					ph_photoURL: gaPhotoURL || "",
					ph_status: ga.ga_status || "Active",
					ph_create_timestamp: serverTimestamp(),
				});
			}
		}

		for (const organizer of organizers) {
			if (organizer.or_email) {
				await sendOrganizerEmail(
					organizer.or_name,
					organizer.or_email,
					eventPhotoURL,
					event.ev_name,
					event.ev_date,
					event.ev_starttime,
					event.ev_endtime,
					event.ev_location,
					event.ev_overview,
					eventId,
					triggerAlert
				);
			}
		}

		triggerAlert("success", "Event updated successfully");
		navigate("/admin/events/eventsdetails?id=" + eventId);
		return true;
	} catch (error) {
		triggerAlert("danger", "Error updating event: " + error.message);
		throw error;
	} finally {
		setBtnloading(false);
	}
};
