import {
	doc,
	getDoc,
	collection,
	query,
	where,
	getDocs,
	onSnapshot,
} from "firebase/firestore";
import { db } from "../../../server/firebaseConfig";

// Utility functions for date/time formatting
const formatDate = (date) => date.toDate().toISOString().split("T")[0];
const formatTime = (date) => date.toDate().toTimeString().slice(0, 5);

// Main function to fetch event details
export const getEventDetails = (
	ev_id,
	setEvent,
	setOrganizer,
	setSpeaker,
	setGallery,
	triggerAlert,
	setLoading,
	isForm = true
) => {
	try {
		setLoading(true);

		const eventDocRef = doc(db, "events", ev_id);

		// Real-time listener
		const unsubscribe = onSnapshot(
			eventDocRef,
			async (docSnapshot) => {
				try {
					if (!docSnapshot.exists()) {
						triggerAlert?.("danger", `No event found with ID: ${ev_id}`);
						return;
					}

					const eventData = { id: docSnapshot.id, ...docSnapshot.data() };

					setEvent({
						ev_ayID: eventData.ev_ayID.id,
						ev_name: eventData.ev_name,
						ev_status: eventData.ev_status,
						ev_type: eventData.ev_type,
						ev_date: formatDate(eventData.ev_date),
						ev_starttime: formatTime(eventData.ev_starttime),
						ev_endtime: formatTime(eventData.ev_endtime),
						ev_rsvplink: eventData.ev_rsvplink,
						ev_location: eventData.ev_location,
						ev_overview: eventData.ev_overview,
						ev_photoURL: eventData.ev_photoURL,
					});

					await getEventOrganizer(
						eventData.ev_organizer,
						setOrganizer,
						!isForm,
						triggerAlert
					);
					await getEventSpeaker(eventDocRef, setSpeaker, triggerAlert);
					await getEventGallery(eventDocRef, setGallery, triggerAlert);
				} catch (error) {
					triggerAlert?.("danger", `Realtime error: ${error.message}`);
				} finally {
					setLoading(false);
				}
			},
			(error) => {
				triggerAlert?.("danger", `Realtime listener error: ${error.message}`);
				setLoading(false);
			}
		);

		return unsubscribe;
	} catch (error) {
		triggerAlert?.("danger", `Unexpected error: ${error.message}`);
		setLoading(false);
	}
};

// Combined organizer fetcher
const getEventOrganizer = async (
	organizerList,
	setOrganizer,
	useUserLookup = false,
	triggerAlert
) => {
	try {
		let organizerData;

		if (useUserLookup) {
			organizerData = await Promise.all(
				organizerList.map(async (item) => {
					const [id] = item.split("|");
					const userDocRef = doc(db, "users", id);
					const docSnapshot = await getDoc(userDocRef);

					if (docSnapshot.exists()) {
						const data = docSnapshot.data();
						return {
							or_id: data.uid || id,
							or_name: `${data.us_fname} ${data.us_lname}`.trim(),
							or_email: data.us_email || "",
							or_photoURL: data.us_photoURL || "",
						};
					}
					return null;
				})
			);
		} else {
			organizerData = organizerList.map((item) => {
				const [id, name] = item.split("|");
				return {
					or_status: "Active",
					or_id: id,
					or_name: name,
				};
			});
		}

		setOrganizer(organizerData.filter(Boolean));
	} catch (error) {
		triggerAlert?.(
			"danger",
			`Error fetching organizer details: ${error.message}`
		);
	}
};

// Fetch speakers
const getEventSpeaker = async (ev_id, setSpeaker, triggerAlert) => {
	try {
		const speakerRef = collection(db, "speaker");
		const q = query(speakerRef, where("sp_evID", "==", ev_id));
		const snapshot = await getDocs(q);

		const speakerData = snapshot.docs.map((doc) => {
			const d = doc.data();
			return {
				sp_id: doc.id,
				sp_status: d.sp_status,
				sp_name: d.sp_name,
				sp_info: d.sp_info,
				sp_photoURL: d.sp_photoURL,
			};
		});

		setSpeaker(speakerData);
	} catch (error) {
		triggerAlert?.(
			"danger",
			`Error fetching speaker details: ${error.message}`
		);
	}
};

// Fetch gallery
const getEventGallery = async (ev_id, setGallery, triggerAlert) => {
	try {
		const photosRef = collection(db, "photos");
		const q = query(photosRef, where("ph_evID", "==", ev_id));
		const snapshot = await getDocs(q);

		const photosData = snapshot.docs.map((doc) => {
			const d = doc.data();
			return {
				ga_id: doc.id,
				ga_status: d.ph_status,
				ga_photoURL: d.ph_photoURL,
			};
		});

		setGallery(photosData);
	} catch (error) {
		triggerAlert?.(
			"danger",
			`Error fetching gallery details: ${error.message}`
		);
	}
};
