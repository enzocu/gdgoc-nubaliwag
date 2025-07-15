import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import "../../../style/adminStyle/events.css";

import { RxCross2 } from "react-icons/rx";
import { VscLinkExternal } from "react-icons/vsc";
import { MdDeleteForever } from "react-icons/md";

import upload from "../../../assets/upload.png";

import HeaderFormAdmin from "../../../view/components/headerFormAdmin";

import { useAlert } from "../../context/alertProvider";
import { useUser } from "../../context/userContext";
import { useLoading } from "../../context/loadingProvider";

import { handleChange } from "../../../controller/customAction/handleChange";
import { organizerChange } from "../../../controller/customAction/organizerChange";
import {
	speakerChange,
	selectedSpeaker,
	updateSpeaker,
} from "../../../controller/customAction/speakerChange";
import { galleryChange } from "../../../controller/customAction/galleryChange";
import { toggleStatus } from "../../../controller/customAction/toggleStatus";
import UrlUpload from "../../components/boostrap/urlModal";

import { insertEvent } from "../../../controller/firebase/insert/insertEvents";
import { updateEvent } from "../../../controller/firebase/update/updateEvent";
import { getEventDetails } from "../../../controller/firebase/get/getEventdetails";
import { getMembers } from "../../../controller/firebase/get/getCoreMembers";
import { getAcademicYears } from "../../../controller/firebase/get/getAcademicYears";
import { openModal } from "../../../controller/customAction/showcloseModal";

const defaultEvent = {
	ev_ayID: "",
	ev_name: "",
	ev_type: "",
	ev_date: null,
	ev_starttime: null,
	ev_endtime: null,
	ev_location: "",
	ev_rsvplink: "",
	ev_overview: "",
	ev_organizer: "",
	ev_photoURL:
		"https://res.cloudinary.com/startup-grind/image/upload/c_fill,dpr_2.0,f_auto,g_center,q_auto:good/v1/gcs/platform-data-goog/events/gdsc_jaCyFcF.jpg",
	ev_spindex: null,
	ev_spid: null,
	ev_spname: "",
	ev_spinfo: "",
	ev_spphotoURL: "",
};

function EventsForm() {
	const location = useLocation();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const action = searchParams.get("action");
	const id = searchParams.get("id");

	const { triggerAlert } = useAlert();
	const { user, userDetails, loading } = useUser();
	const { setLoading, setPath } = useLoading();
	const eventImageref = useRef(null);
	const galleryImageref = useRef(null);

	const [btnloading, setBtnloading] = useState(false);
	const [event, setEvent] = useState(defaultEvent);
	const [organizerlist, setOrganizerlist] = useState([]);
	const [organizer, setOrganizer] = useState([]);
	const [speaker, setSpeaker] = useState([]);
	const [gallery, setGallery] = useState([]);
	const [academicYear, setAcademicYear] = useState([]);

	const [url, setUrl] = useState({
		name: null,
		state: null,
		setState: () => {},
	});

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (action == "add") {
			if (!loading && user && userDetails) {
				await insertEvent(
					userDetails.us_ayID.id,
					event,
					organizer,
					speaker,
					gallery,
					triggerAlert,
					setBtnloading,
					navigate
				);
			}

			setEvent(defaultEvent);
			setOrganizer([]);
			setSpeaker([]);
			setGallery([]);
		} else if (action == "edit" && id) {
			if (!loading && user && userDetails) {
				await updateEvent(
					id,
					event,
					organizer,
					speaker,
					gallery,
					triggerAlert,
					setBtnloading,
					navigate
				);
			}
		}
	};

	useEffect(() => {
		if (action === "edit" && id) {
			setPath(location.pathname);
			const unsubscribe = getEventDetails(
				id,
				setEvent,
				setOrganizer,
				setSpeaker,
				setGallery,
				triggerAlert,
				setLoading,
				true
			);

			return () => unsubscribe();
		}
	}, [id]);

	useEffect(() => {
		if (!loading && event.ev_ayID) {
			getMembers(
				event.ev_ayID,
				null,
				null,
				setOrganizerlist,
				setLoading,
				triggerAlert,
				100
			);
		}
	}, [event.ev_ayID]);

	useEffect(() => {
		if (!loading && user && userDetails) {
			getAcademicYears(setAcademicYear);
		}
	}, [loading]);

	const goBack = () => navigate(-1);
	return (
		<div className="admin-body form">
			<UrlUpload name={url.name} state={url.state} setState={url.setState} />
			<main>
				<HeaderFormAdmin Title="Add Event" />
				<form className="content-form events" onSubmit={handleSubmit}>
					<section className="form-group form-group-main">
						<div className="form-subgroup form-subgroup-event-details">
							<div className="form-row-name-type">
								<div className="form-field">
									<label>Event Name </label>
									<input
										type="text"
										className="form-control"
										name="ev_name"
										placeholder="Event Name"
										required
										value={event.ev_name || ""}
										onChange={(e) => handleChange(e, setEvent)}
									/>
								</div>
								<div className="form-field">
									<label>Event Type</label>
									<select
										className="form-control"
										name="ev_type"
										required
										value={event.ev_type || ""}
										onChange={(e) => handleChange(e, setEvent)}
									>
										<option value="">Select Type</option>
										<option value="Workshop">Workshop</option>
										<option value="Seminar">Seminar</option>
										<option value="Peer-to-Peer session">
											Peer-to-Peer session
										</option>
										<option value="Social networking">Social networking</option>
									</select>
								</div>
							</div>

							<div className="form-row-date-time">
								<div className="form-time-row">
									<div className="form-field date">
										<label>Event A.Y </label>
										<select
											className="form-control"
											name="ev_ayID"
											value={event.ev_ayID || ""}
											onChange={(e) => handleChange(e, setEvent)}
											required
										>
											<option value="">Select A.Y</option>
											{academicYear.map((item) => (
												<option key={item.id} value={item.id}>
													{`A.Y ${item.ay_academicyear}`}
												</option>
											))}
										</select>
									</div>
									<div className="form-field date">
										<label>Event Date</label>
										<input
											type="date"
											className="form-control"
											name="ev_date"
											required
											value={event.ev_date || ""}
											onChange={(e) => handleChange(e, setEvent)}
										/>
									</div>
								</div>

								<div className="form-time-row">
									<div className="form-field">
										<label>Start Time</label>
										<input
											type="time"
											className="form-control"
											name="ev_starttime"
											required
											value={event.ev_starttime || ""}
											onChange={(e) => handleChange(e, setEvent)}
										/>
									</div>
									<div className="form-field">
										<label>End Time</label>
										<input
											type="time"
											className="form-control"
											name="ev_endtime"
											required
											value={event.ev_endtime || ""}
											min={event.ev_starttime || ""}
											onChange={(e) => handleChange(e, setEvent)}
										/>
									</div>
								</div>
							</div>

							<div className="form-row-date-organizer">
								<div className="form-field">
									<label>Event Venue</label>
									<input
										type="text"
										className="form-control"
										name="ev_location"
										placeholder="Event Location"
										required
										value={event.ev_location || ""}
										onChange={(e) => handleChange(e, setEvent)}
									/>
								</div>

								{event.ev_ayID != "" && (
									<div className="form-field">
										<label>Organizer</label>
										<select
											className="form-control"
											name="ev_organizer"
											value={event.ev_organizer || ""}
											onChange={(e) =>
												organizerChange(
													e.target.value,
													organizer,
													setOrganizer,
													setEvent
												)
											}
										>
											<option value="">Select Organizer</option>
											{organizerlist.map((item, index) => (
												<option
													key={index}
													value={`${item.id}|${item.us_fname} ${item.us_lname}|${item.us_email}`}
												>
													{item.us_fname} {item.us_lname}
												</option>
											))}
										</select>
									</div>
								)}
							</div>
						</div>

						<div className="form-subgroup form-subgroup-image">
							<span>
								<label>Event Image</label>
								<VscLinkExternal
									className="upload-url"
									onClick={() => {
										openModal("urlModal");
										setUrl({
											name: "ev_photoURL",
											state: null,
											setState: setEvent,
										});
									}}
								/>
							</span>

							<input
								type="file"
								className="form-control"
								name="ev_photoURL"
								ref={eventImageref}
								style={{ display: "none" }}
								onChange={(e) => handleChange(e, setEvent)}
							/>
							<div
								className="form-image-container"
								onClick={() => eventImageref.current.click()}
							>
								<img
									src={
										event.ev_photoURL instanceof File
											? URL.createObjectURL(event.ev_photoURL)
											: event.ev_photoURL
									}
									alt="Event Photo"
								/>
							</div>
						</div>
					</section>

					<section className="form-group form-group-more">
						{organizer.length > 0 && (
							<div className="form-subgroup form-subgroup-organizers">
								<label>Organizers</label>
								<ul className="organizer-list">
									{organizer.map((item, index) => (
										<li key={index}>
											<span>{item.or_name}</span>
											<RxCross2
												className="icon"
												onClick={() =>
													toggleStatus(index, setOrganizer, null, null)
												}
											/>
										</li>
									))}
								</ul>
							</div>
						)}

						<div className="form-field">
							<label>RSVP Link</label>
							<input
								type="url"
								className="form-control"
								name="ev_rsvplink"
								placeholder="https://example.com"
								required
								value={event.ev_rsvplink || ""}
								onChange={(e) => handleChange(e, setEvent)}
							/>
						</div>

						<div className="form-subgroup form-subgroup-speaker">
							<label>Speaker</label>
							<div className="speaker-wrapper">
								<div className="speaker-fields">
									<div className="form-field">
										<label>Speaker Name</label>
										<input
											type="text"
											className="form-control"
											name="ev_spname"
											placeholder="Speaker Name"
											value={event.ev_spname || ""}
											onChange={(e) => handleChange(e, setEvent)}
										/>
									</div>
									<div className="form-field">
										<label>Speaker Info</label>
										<textarea
											className="form-control min-height-100"
											name="ev_spinfo"
											placeholder="Speaker Background"
											value={event.ev_spinfo || ""}
											onChange={(e) => handleChange(e, setEvent)}
										/>
									</div>
									<div className="form-field">
										<span>
											<label>Speaker Image</label>
											<VscLinkExternal
												className="upload-url"
												onClick={() => {
													openModal("urlModal");
													setUrl({
														name: "ev_spphotoURL",
														state: null,
														setState: setEvent,
													});
												}}
											/>
										</span>
										<input
											type="file"
											className="form-control"
											name="ev_spphotoURL"
											onChange={(e) => handleChange(e, setEvent)}
										/>
									</div>
								</div>

								<div className="form-speaker-actions">
									<button
										type="button"
										className="form-btn form-btn-add"
										style={{
											color:
												!event.ev_spname || !event.ev_spinfo
													? "gray"
													: "var(--bg-button-color)",
										}}
										disabled={!event.ev_spname || !event.ev_spinfo}
										onClick={() =>
											event.ev_spindex == null
												? speakerChange(event, setSpeaker, setEvent)
												: updateSpeaker(event, speaker, setSpeaker, setEvent)
										}
									>
										{event.ev_spindex == null
											? "Add Speaker"
											: "Update Speaker"}
									</button>
								</div>

								{speaker.filter((sp) => sp.sp_status !== "Inactive").length >
									0 && (
									<div className="form-subgroup form-subgroup-speaker">
										<label>Added Speaker</label>
										<ul className="speaker-list">
											{speaker.map((item, index) => (
												<li
													key={index}
													style={{
														display:
															item.sp_status === "Inactive" ? "none" : "flex",
													}}
												>
													<span
														onClick={() =>
															selectedSpeaker(index, speaker, setEvent)
														}
													>
														{item.sp_name}
													</span>
													<RxCross2
														className="icon"
														onClick={() =>
															toggleStatus(
																index,
																setSpeaker,
																"sp_id",
																"sp_status"
															)
														}
													/>
												</li>
											))}
										</ul>
									</div>
								)}
							</div>
						</div>

						<div className="form-field">
							<label>Overview</label>
							<textarea
								name="ev_overview"
								className="form-control"
								required
								placeholder="Brief description about the event"
								value={event.ev_overview || ""}
								onChange={(e) => handleChange(e, setEvent)}
								rows="10"
							></textarea>
						</div>

						<div className="form-subgroup form-subgroup-gallery">
							<span>
								<label>Gallery</label>
								<VscLinkExternal
									className="upload-url"
									onClick={() => {
										openModal("urlModal");
										setUrl({
											name: null,
											state: galleryChange,
											setState: setGallery,
										});
									}}
								/>
							</span>
							<div className="form-gallery-container-list">
								<div
									className="form-image-container"
									onClick={() => galleryImageref.current.click()}
								>
									<input
										type="file"
										className="form-control"
										name="ev_gaphoto"
										ref={galleryImageref}
										style={{ display: "none" }}
										onChange={(e) => galleryChange(e.target.files, setGallery)}
									/>
									<img src={upload} alt="Event Photo" />
								</div>

								{gallery.length > 0 &&
									gallery.map((item, index) => (
										<div
											key={index}
											className="form-image-container image-with-remove"
											style={{
												display:
													item.ga_status === "Inactive" ? "none" : "block",
											}}
										>
											{/* Remove icon using react-icon */}
											<MdDeleteForever
												className="remove-icon"
												onClick={(e) => {
													e.stopPropagation();
													toggleStatus(index, setGallery, "ga_id", "ga_status");
												}}
											/>

											<img
												src={
													item.ga_photoURL instanceof File
														? URL.createObjectURL(item.ga_photoURL)
														: item.ga_photoURL
												}
												alt="gallery"
											/>
										</div>
									))}
							</div>
						</div>
					</section>
					<section className="form-group form-group-buttons">
						<button
							type="submit"
							className="btn form-btn form-btn btn-primary"
							disabled={organizer.length < 1}
						>
							{btnloading ? (
								<span className="spinner-border spinner-border-sm"></span>
							) : (
								"Save"
							)}
						</button>
						<button
							type="button"
							className="btn form-btn btn-outline-primary"
							onClick={goBack}
						>
							Cancel
						</button>
					</section>
				</form>
			</main>
		</div>
	);
}

export default EventsForm;
