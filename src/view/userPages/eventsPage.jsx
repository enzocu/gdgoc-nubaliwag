import { useState, useEffect } from "react";
import "../../style/userStyle/eventsprojects.css";

import Lottie from "lottie-react";
import noevent from "../../assets/noevent.json";

import { IoCalendarClearOutline } from "react-icons/io5";
import { IoTimeOutline } from "react-icons/io5";
import { IoLocationOutline } from "react-icons/io5";
import { FiSearch, FiChevronLeft, FiChevronRight } from "react-icons/fi";

import { useNavigate, useLocation } from "react-router-dom";
import { useAlert } from "../context/alertProvider";
import { useAcadYear } from "../context/acadyearContext";
import { useLoading } from "../context/loadingProvider";

import {
	getEvents,
	getEventCount,
} from "../../controller/firebase/get/getEvents";
import Footer from "../components/footer";

function EventsPage() {
	const location = useLocation();
	const navigate = useNavigate();
	const { triggerAlert } = useAlert();
	const { acadYear, loading: acadLoading } = useAcadYear();
	const { setLoading, setPath, loading: appLoading } = useLoading();

	const [activeTab, setActiveTab] = useState("Upcoming");
	const [events, setEvent] = useState([]);
	const [search, setSearch] = useState(null);

	//PAGINATION
	const [pageCursors, setPageCursors] = useState([]);
	const pageLimit = 6;
	const [currentPage, setCurrentPage] = useState(1);
	const [ctrPages, setCtrPage] = useState(1);
	const [nextPage, setNextPage] = useState(0);

	useEffect(() => {
		if (!acadLoading && acadYear) {
			setPath(location.pathname);

			getEvents(
				acadYear.id,
				activeTab,
				null,
				search,
				setEvent,
				setLoading,
				triggerAlert,
				pageLimit,
				pageCursors,
				setPageCursors,
				currentPage
			);
		}
	}, [acadLoading, acadYear, activeTab, search, nextPage]);

	useEffect(() => {
		if (!acadLoading && acadYear) {
			getEventCount(acadYear.id, activeTab, null, pageLimit, setCtrPage);
		}
	}, [acadLoading, acadYear, activeTab]);
	return (
		<>
			<div className="user-body event">
				<main>
					<section className="header-container">
						<div className="header-content">
							<h1>Events & Activities</h1>
							<p>
								Discover our upcoming and past events, workshops, and
								activities.
							</p>
						</div>
					</section>
					<section className="gdg-container">
						<div className="gdg-tabs">
							<button
								className={`gdg-tab-btn ${
									activeTab === "Upcoming" ? "active" : ""
								}`}
								onClick={() => {
									setActiveTab("Upcoming");
									setPageCursors([]);
								}}
							>
								Upcoming Events
							</button>
							<button
								className={`gdg-tab-btn ${
									activeTab === "Completed" ? "active" : ""
								}`}
								onClick={() => {
									setActiveTab("Completed");
									setPageCursors([]);
								}}
							>
								Past Events
							</button>
						</div>
						<div className="gdg-search-container">
							<span className="gdg-search-icon">
								<FiSearch />
							</span>
							<input
								type="text"
								placeholder="Search Event"
								className="form-control gdg-search-input"
								value={search || ""}
								onChange={(e) => setSearch(e.target.value)}
							/>
						</div>

						{events.length === 0 && !appLoading ? (
							<div className="no-event-lottie-container">
								<Lottie animationData={noevent} loop={true} />
							</div>
						) : (
							<>
								<div className="gdg-grid">
									{events.map((ev) => (
										<div className="gdg-event-card" key={ev.id}>
											<div className="gdg-event-image">
												<span className="gdg-event-type">
													{ev.ev_type || "N/A"}
												</span>
												<img
													src={ev.ev_photoURL || "/placeholder.svg"}
													alt={ev.ev_name || "Event Image"}
												/>
											</div>
											<div className="gdg-event-content">
												<h3 className="gdg-event-title">
													{ev.ev_name || "Untitled Event"}
												</h3>

												<div className="gdg-event-details">
													<div className="gdg-event-detail">
														<IoCalendarClearOutline className="gdg-event-icon" />
														<span>
															{ev.ev_date
																? new Date(
																		ev.ev_date.seconds * 1000
																  ).toLocaleDateString(undefined, {
																		year: "numeric",
																		month: "long",
																		day: "numeric",
																  })
																: "Date N/A"}
														</span>
													</div>
													<div className="gdg-event-detail">
														<IoTimeOutline className="gdg-event-icon" />
														<span>
															{ev.ev_starttime && ev.ev_endtime
																? `${new Date(
																		ev.ev_starttime.seconds * 1000
																  ).toLocaleTimeString([], {
																		hour: "2-digit",
																		minute: "2-digit",
																  })} - ${new Date(
																		ev.ev_endtime.seconds * 1000
																  ).toLocaleTimeString([], {
																		hour: "2-digit",
																		minute: "2-digit",
																  })}`
																: "Time N/A"}
														</span>
													</div>
													<div className="gdg-event-detail">
														<IoLocationOutline className="gdg-event-icon" />
														<span>{ev.ev_location || "Location N/A"}</span>
													</div>
												</div>

												<p className="gdg-event-description">
													{ev.ev_overview
														? ev.ev_overview.length > 100
															? ev.ev_overview.slice(0, 130) + "..."
															: ev.ev_overview
														: " "}
												</p>

												<button
													className="gdg-view-details-btn"
													onClick={() =>
														navigate(`/user/events/eventsdetails?id=${ev.id}`)
													}
												>
													View Details
												</button>
											</div>
										</div>
									))}
								</div>

								{ctrPages > 1 && (
									<div className="pagination-container">
										<div className="page-select-group">
											<span className="page-label">This page on</span>
											<select
												value={currentPage}
												onChange={(e) => {
													setCurrentPage(parseInt(e.target.value));
													setNextPage(nextPage + 1);
												}}
												className="page-select"
											>
												{Array.from({ length: ctrPages }, (_, i) => (
													<option key={i + 1} value={i + 1}>
														{i + 1}
													</option>
												))}
											</select>
										</div>

										<div className="page-nav-group">
											<button
												className="page-btn"
												onClick={() => {
													setCurrentPage((prev) => Math.max(prev - 1, 1));
													setNextPage(nextPage + 1);
												}}
												disabled={currentPage === 1}
											>
												<FiChevronLeft className="page-icon" />
											</button>

											<button
												className="page-btn"
												onClick={() => {
													setCurrentPage((prev) =>
														Math.min(prev + 1, ctrPages)
													);
													setNextPage(nextPage + 1);
												}}
												disabled={currentPage === ctrPages}
											>
												<FiChevronRight className="page-icon" />
											</button>
										</div>
									</div>
								)}
							</>
						)}
					</section>
				</main>
				<Footer />
			</div>
		</>
	);
}

export default EventsPage;
