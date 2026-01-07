import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import "../../../style/adminStyle/members.css";
import { VscLinkExternal } from "react-icons/vsc";

import HeaderFormAdmin from "../../../view/components/headerFormAdmin";
import UrlUpload from "../../components/boostrap/urlModal";

import { RxCross2 } from "react-icons/rx";

import { useAlert } from "../../../provider/alertProvider";
import { useUser } from "../../../provider/userProvider";
import { useLoading } from "../../../provider/loadingProvider";

import { handleChange } from "../../../lib/helper/handleChange";
import {
	roleChange,
	selectedMember,
	removeMember,
} from "../../../lib/helper/roleChange";

import { openModal } from "../../../lib/helper/showcloseModal";

import { insertMember } from "../../../lib/firebase/insert/insertMember";
import { updateMember } from "../../../lib/firebase/update/updateMember";
import { getMemberdetails } from "../../../lib/firebase/get/getMemberdetails";
import { getAcademicYears } from "../../../lib/firebase/get/getAcademicYears";

const defaultMember = {
	me_acadyear: [],
	me_fname: "",
	me_mname: "",
	me_lname: "",
	me_suffix: "",
	me_studentID: "",
	me_email: "",
	me_photoURL: "",

	me_yearIndex: null,
	me_roleIndex: null,
	me_roleName: "",
	me_roleAcadyearID: "",
	me_roleAcadyearName: "",
	me_roleType: "",
};

function MembersForm() {
	const navigate = useNavigate();
	const location = useLocation();
	const [searchParams] = useSearchParams();
	const action = searchParams.get("action");
	const id = searchParams.get("id");

	const { triggerAlert } = useAlert();
	const { user, userDetails, loading } = useUser();
	const { setLoading, setPath } = useLoading();
	const memberImageref = useRef(null);

	const [btnloading, setBtnloading] = useState(false);
	const [member, setMember] = useState(defaultMember);
	const [academicYear, setAcademicYear] = useState([]);

	const [url, setUrl] = useState({
		name: null,
		state: null,
		setState: () => {},
	});

	const handleSubmit = (e) => {
		e.preventDefault();

		if (action == "add") {
			if (!loading && user && userDetails) {
				insertMember(userDetails.us_ayID, member, triggerAlert, setBtnloading);
			}
		} else if (action == "edit" && id) {
			if (!loading && user && userDetails) {
				updateMember(
					userDetails.us_ayID,
					id,
					member,
					triggerAlert,
					setBtnloading,
				);
			}
		}

		setMember(defaultMember);
	};

	useEffect(() => {
		if (action === "edit" && id) {
			setPath(location.pathname);
			const unsubscribe = getMemberdetails(
				id,
				setMember,
				triggerAlert,
				setLoading,
			);

			return () => unsubscribe();
		}
	}, [id]);

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
				<HeaderFormAdmin Title="Add Core Member" />
				<form className="content-form members" onSubmit={handleSubmit}>
					<section className="form-group form-group-image">
						<span>
							<label htmlFor="me_photoURL">Image</label>
							<VscLinkExternal
								className="upload-url"
								onClick={() => {
									openModal("urlModal");
									setUrl({
										name: "me_photoURL",
										state: null,
										setState: setMember,
									});
								}}
							/>
						</span>
						<input
							type="file"
							className="form-control"
							name="me_photoURL"
							ref={memberImageref}
							style={{ display: "none" }}
							onChange={(e) => handleChange(e, setMember)}
						/>
						<div
							className="form-image-container"
							onClick={() => memberImageref.current.click()}
						>
							<img
								src={
									member.me_photoURL
										? member.me_photoURL instanceof File
											? URL.createObjectURL(member.me_photoURL)
											: member.me_photoURL
										: "https://res.cloudinary.com/startup-grind/image/upload/c_fill,dpr_2.0,f_auto,g_center,q_auto:good/v1/gcs/platform-data-goog/events/gdsc_jaCyFcF.jpg"
								}
								alt="Member Photo"
							/>
						</div>
					</section>

					<section className="form-group form-group-details">
						<div className="form-subgroup form-subgroup-name">
							<label>Name</label>
							<div className="form-fields">
								{["me_fname", "me_mname", "me_lname", "me_suffix"].map(
									(field, idx) => (
										<input
											key={field}
											type="text"
											className="form-control"
											placeholder={
												["First", "Middle", "Last", "Suffix"][idx] + " Name"
											}
											name={field}
											value={member[field] || ""}
											onChange={(e) => handleChange(e, setMember)}
											required={field !== "me_suffix"}
										/>
									),
								)}
							</div>
						</div>

						{/* Contact Fields */}
						<div className="form-subgroup form-subgroup-contact">
							<div className="form-field">
								<label>Email</label>
								<input
									type="email"
									className="form-control"
									placeholder="Enter Email"
									name="me_email"
									value={member.me_email || ""}
									onChange={(e) => handleChange(e, setMember)}
									required
								/>
							</div>
							<div className="form-field">
								<label>Student ID</label>
								<input
									type="text"
									className="form-control"
									placeholder="Enter Student ID"
									name="me_studentID"
									value={member.me_studentID || ""}
									onChange={(e) => handleChange(e, setMember)}
									pattern="\d{4}-\d{6}"
									title="Format must be YYYY-###### (e.g., 2024-161417)"
									required
								/>
							</div>
						</div>

						{/* Role Fields */}
						<div className="form-subgroup form-subgroup-role">
							<label>Role Information</label>
							<div className="form-role-fields-wrapper">
								<div className="form-role-fields">
									<div className="form-field">
										<label>Role</label>
										<input
											type="text"
											className="form-control"
											placeholder="Enter Role"
											name="me_roleName"
											value={member.me_roleName || ""}
											onChange={(e) => handleChange(e, setMember)}
										/>
									</div>

									<div className="form-field">
										<label>Academic Year</label>
										<select
											className="form-control"
											name="me_roleAcadyearID"
											value={member.me_roleAcadyearID || ""}
											onChange={(e) => {
												const selectedId = e.target.value;
												const selectedOption = e.target.selectedOptions[0];
												const selectedName =
													selectedOption.getAttribute("data-year");

												setMember((prev) => ({
													...prev,
													me_roleAcadyearID: selectedId,
													me_roleAcadyearName: selectedName,
												}));
											}}
										>
											<option value="">Select Academic Year</option>
											{academicYear.map((item) => (
												<option
													key={item.id}
													value={item.id}
													data-year={item.ay_academicyear}
												>
													{`A.Y ${item.ay_academicyear}`}
												</option>
											))}
										</select>
									</div>

									<div className="form-field">
										<label>Role Type</label>
										<select
											className="form-control"
											name="me_roleType"
											value={member.me_roleType || ""}
											onChange={(e) => handleChange(e, setMember)}
										>
											<option value="">Select Role Type</option>
											{[
												"Organization Lead",
												"Adviser",
												"Executive Board",
												"Core Lead",
												"Technology Department",
											].map((role, index) => (
												<option key={index} value={role}>
													{role}
												</option>
											))}
										</select>
									</div>
								</div>

								<div className="form-role-actions">
									<button
										type="button"
										className="form-btn form-btn-add"
										style={{
											color:
												!member.me_roleName ||
												!member.me_roleAcadyearID ||
												!member.me_roleType
													? "gray"
													: "var(--bg-button-color)",
										}}
										disabled={
											!member.me_roleName ||
											!member.me_roleAcadyearID ||
											!member.me_roleType
										}
										onClick={() => {
											if (
												!member.me_roleName ||
												!member.me_roleAcadyearID ||
												!member.me_roleType
											)
												return;

											if (
												member.me_yearIndex == null ||
												member.me_roleIndex == null
											) {
												roleChange(member, setMember);
											} else if (
												member.me_yearIndex != null ||
												member.me_roleIndex != null
											) {
												roleChange(member, setMember);
											}
										}}
									>
										{member.me_yearIndex == null || member.me_roleIndex == null
											? "Add Role"
											: "Update Role"}
									</button>
								</div>

								{member.me_acadyear.length > 0 && (
									<div className="form-subgroup-role">
										<label>Added Roles</label>
										<ul className="role-list">
											{member.me_acadyear.map((acadItem, i) =>
												(acadItem.us_role || []).map((roleItem, j) => (
													<li key={`${i}-${j}`}>
														<span
															onClick={() =>
																selectedMember(i, j, member, setMember)
															}
														>
															{[
																roleItem.role || "No Role",
																"A.Y " + acadItem.us_yrname || "No Year",
																roleItem.type || "No Type",
															].join(" • ")}
														</span>
														<RxCross2
															className="icon"
															onClick={() => removeMember(i, j, setMember)}
														/>
													</li>
												)),
											)}
										</ul>
									</div>
								)}
							</div>
						</div>
					</section>
					<section className="form-group form-group-buttons">
						<button type="submit" className="btn form-btn form-btn btn-primary">
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

export default MembersForm;
