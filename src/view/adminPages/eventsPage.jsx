import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import "../../style/adminStyle/events.css";

import { MdAdd } from "react-icons/md";
import Lottie from "lottie-react";
import noevent from "../../assets/noevent.json";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

import SideBar from "../components/sideBar";
import HeaderPageAdmin from "../components/headerPageAdmin";

import { useUser } from "../context/userContext";
import { useLoading } from "../context/loadingProvider";
import { useAlert } from "../context/alertProvider";

import { toggleDropdown } from "../../controller/customAction/showcloseModal";

import {
	getEvents,
	getEventCount,
} from "../../controller/firebase/get/getEvents";
import { getAcademicYears } from "../../controller/firebase/get/getAcademicYears";

function EventsPage() {
	const location = useLocation();

	const { triggerAlert } = useAlert();
	const { user, userDetails, loading: userLoading } = useUser();
	const { setLoading, setPath, loading: appLoading } = useLoading();

	const [search, setSearch] = useState(null);
	const [evStatus, setStatus] = useState(null);
	const [evType, setType] = useState(null);
	const [event, setEvent] = useState([]);
	const [academicYear, setAcademicYear] = useState([]);
	const [acadyear, setAcadyear] = useState(null);

	//PAGINATION
	const [pageCursors, setPageCursors] = useState([]);
	const pageLimit = 6;
	const [currentPage, setCurrentPage] = useState(1);
	const [ctrPages, setCtrPage] = useState(1);
	const [nextPage, setNextPage] = useState(0);

	useEffect(() => {
		if (!userLoading && user && userDetails) {
			setPath(location.pathname);

			getEvents(
				acadyear == null ? userDetails.us_ayID.id : acadyear,
				evStatus,
				evType,
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
	}, [userLoading, search, acadyear, evStatus, evType, nextPage]);

	useEffect(() => {
		if (!userLoading && user) {
			getEventCount(
				acadyear == null ? userDetails.us_ayID.id : acadyear,
				evStatus,
				evType,
				pageLimit,
				setCtrPage
			);
		}
	}, [userLoading, acadyear, evStatus, evType]);

	useEffect(() => {
		if (!userLoading && user && userDetails) {
			getAcademicYears(setAcademicYear);
		}
	}, [userLoading]);

	return (
		<>
			<div className="admin-body">
				<SideBar />
				<main>
					<HeaderPageAdmin Title="Events" />
					<div className="content-page events">
						<section className="function-container">
							<div className="filter-group">
								<div className="input-group ">
									<input
										type="text"
										className="form-control"
										placeholder="Search"
										value={search || ""}
										onChange={(e) => setSearch(e.target.value)}
									/>

									<button
										type="button"
										className="btn btn-outline-primary dropdown-toggle form-btn"
										onClick={() => toggleDropdown("status")}
									>
										Status
									</button>
									<ul className="dropdown-menu form-menu" id="status">
										<li
											className="dropdown-item"
											onClick={() => {
												setStatus(null);
												toggleDropdown("status");
											}}
										>
											All
										</li>
										<li
											className="dropdown-item"
											onClick={() => {
												setStatus("Upcoming");
												toggleDropdown("status");
												setPageCursors([]);
											}}
										>
											Upcoming
										</li>
										<li
											className="dropdown-item"
											onClick={() => {
												setStatus("Completed");
												toggleDropdown("status");
												setPageCursors([]);
											}}
										>
											Completed
										</li>
										<li
											className="dropdown-item"
											onClick={() => {
												setStatus("Archived");
												toggleDropdown("status");
												setPageCursors([]);
											}}
										>
											Archieved
										</li>
									</ul>

									<button
										type="button"
										className="btn btn-outline-primary dropdown-toggle form-btn"
										data-bs-toggle="dropdown"
										onClick={() => toggleDropdown("acadyear")}
									>
										Academic Year
									</button>
									<ul className="dropdown-menu form-menu" id="acadyear">
										{academicYear.map((item) => (
											<li
												className="dropdown-item"
												key={item.id}
												onClick={() => {
													setAcadyear(item.id);
													toggleDropdown("acadyear");
													setPageCursors([]);
												}}
											>{`A.Y ${item.ay_academicyear}`}</li>
										))}
									</ul>
								</div>
							</div>

							<NavLink to="/admin/events/eventsform?action=add">
								<button className="btn btn-primary form-btn">
									<MdAdd />
									<span>Add Event</span>
								</button>
							</NavLink>
						</section>

						{!appLoading && event.length === 0 ? (
							<div className="no-event-lottie-container">
								<Lottie animationData={noevent} loop={true} />
							</div>
						) : (
							<>
								<section className="events-list">
									{event.map((ev) => (
										<NavLink
											key={ev.id}
											to={`/admin/events/eventsdetails?id=${ev.id}`}
										>
											<div className="event-card">
												<div className="event-photo">
													<img
														src={ev.ev_photoURL}
														alt={ev.ev_name || "Event Image"}
													/>
												</div>
												<div className="event-status">
													<div className="event-type">
														{ev.ev_type || "N/A"}
													</div>
													<div className={"event-" + ev.ev_status}>
														{ev.ev_status || "Unknown"}
													</div>
												</div>
												<div className="details">
													<h4>{ev.ev_name || "Untitled Event"}</h4>
													<p>
														{ev.ev_date
															? new Date(
																	ev.ev_date.seconds * 1000
															  ).toLocaleDateString(undefined, {
																	year: "numeric",
																	month: "short",
																	day: "numeric",
															  })
															: "Date N/A"}
													</p>
												</div>
											</div>
										</NavLink>
									))}
								</section>
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
								)}{" "}
							</>
						)}
					</div>
				</main>
			</div>
		</>
	);
}

export default EventsPage;
