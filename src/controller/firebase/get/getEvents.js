import {
	collection,
	query,
	where,
	getDocs,
	doc,
	orderBy,
	limit as limitFn,
} from "firebase/firestore";
import { db } from "../../../server/firebaseConfig";

async function getEvents(
	ay_id = null,
	ev_status = null,
	ev_type = null,
	search = null,
	setEvent,
	setLoading,
	triggerAlert,
	limit = 50
) {
	setLoading?.(true);

	try {
		const eventRef = collection(db, "events");
		const conditions = [];

		// Add filters if provided
		if (ay_id) {
			const ayDocRef = doc(db, "academicyear", ay_id);
			conditions.push(where("ev_ayID", "==", ayDocRef));
		}
		if (ev_status) {
			conditions.push(where("ev_status", "==", ev_status));
		}
		if (ev_type) {
			conditions.push(where("ev_type", "==", ev_type));
		}

		const q = query(
			eventRef,
			...conditions,
			orderBy("ev_date", "desc"),
			limitFn(limit)
		);

		const snapshot = await getDocs(q);

		let events = snapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}));

		if (search?.trim()) {
			const term = search.toLowerCase();
			events = events.filter((ev) => ev.ev_name?.toLowerCase().includes(term));
		}

		setEvent?.(events);
		return events;
	} catch (error) {
		console.error("getEvents error:", error);
		triggerAlert?.("danger", `Error fetching events: ${error.message}`);
		return [];
	} finally {
		setLoading?.(false);
	}
}

export default getEvents;
