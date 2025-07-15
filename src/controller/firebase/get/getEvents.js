import {
	collection,
	query,
	where,
	orderBy,
	limit,
	startAfter,
	getDocs,
	doc,
	getCountFromServer,
} from "firebase/firestore";
import { db } from "../../../server/firebaseConfig";

export const getEvents = async (
	ay_id = null,
	ev_status = null,
	ev_type = null,
	search = null,
	setEvent,
	setLoading,
	triggerAlert,
	pageLimit,
	pageCursors = null,
	setPageCursors = null,
	currentPage = null
) => {
	setLoading?.(true);

	try {
		const evRef = collection(db, "events");
		const conditions = [];

		if (ay_id) {
			conditions.push(where("ev_ayID", "==", doc(db, "academicyear", ay_id)));
		}
		if (ev_status) {
			conditions.push(where("ev_status", "==", ev_status));
		}
		if (ev_type) {
			conditions.push(where("ev_type", "==", ev_type));
		}

		conditions.push(orderBy("ev_date", "desc"));

		let q;
		if (currentPage > 1 && pageCursors?.[currentPage - 2]) {
			q = query(
				evRef,
				...conditions,
				startAfter(pageCursors[currentPage - 2]),
				limit(pageLimit)
			);
		} else {
			q = query(evRef, ...conditions, limit(pageLimit));
		}

		const snapshot = await getDocs(q);

		// Store page cursor
		const lastVisible = snapshot.docs[snapshot.docs.length - 1];
		if (lastVisible && setPageCursors && currentPage !== null) {
			const newCursors = [...pageCursors];
			newCursors[currentPage - 1] = lastVisible;
			setPageCursors(newCursors);
		}

		let events = snapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}));

		// Optional search filter (client-side)
		if (search?.trim()) {
			const term = search.toLowerCase();
			events = events.filter((ev) => ev.ev_name?.toLowerCase().includes(term));
		}

		setEvent?.(events);
		return events;
	} catch (error) {
		console.error("❌ getEvents error:", error);
		triggerAlert?.("danger", "Error fetching events: " + error.message);
		return [];
	} finally {
		setLoading?.(false);
	}
};

export const getEventCount = async (
	ay_id = null,
	ev_status = null,
	ev_type = null,
	pageLimit,
	setCtrPage
) => {
	try {
		const evRef = collection(db, "events");
		const conditions = [];

		if (ay_id) {
			conditions.push(where("ev_ayID", "==", doc(db, "academicyear", ay_id)));
		}
		if (ev_status) {
			conditions.push(where("ev_status", "==", ev_status));
		}
		if (ev_type) {
			conditions.push(where("ev_type", "==", ev_type));
		}

		const countQuery = query(evRef, ...conditions);
		const snap = await getCountFromServer(countQuery);
		const totalCount = snap.data().count;

		if (setCtrPage && pageLimit) {
			const totalPages = Math.ceil(totalCount / pageLimit);
			setCtrPage(totalPages);
		}

		return totalCount;
	} catch (error) {
		console.error("❌ getEventCount error:", error);
		return 0;
	}
};
